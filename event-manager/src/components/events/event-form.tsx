"use client";

import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { CREATE_EVENT, GET_EVENTS } from "@/lib/graphql/queries";
import { getErrorMessage } from "@/lib/error-utils";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";

interface FormikFieldProps {
  field: {
    name: string;
    value: string;
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
  };
  meta: {
    touched: boolean;
    error?: string;
  };
}

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Event title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  eventDate: Yup.date()
    .required("Event date is required")
    .min(
      new Date().toISOString().split("T")[0],
      "Event date cannot be in the past"
    ),
  eventTime: Yup.string().required("Event time is required"),
});

export function EventForm() {
  const router = useRouter();
  const [createEvent, { loading }] = useMutation(CREATE_EVENT, {
    refetchQueries: [{ query: GET_EVENTS }],
  });

  // Generate time options in 12-hour format
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 1; hour <= 12; hour++) {
      for (const minute of [0, 30]) {
        const minuteStr = minute.toString().padStart(2, "0");
        times.push(`${hour}:${minuteStr} AM`);
      }
    }
    for (let hour = 1; hour <= 12; hour++) {
      for (const minute of [0, 30]) {
        const minuteStr = minute.toString().padStart(2, "0");
        times.push(`${hour}:${minuteStr} PM`);
      }
    }
    return times;
  };

  // Convert 12-hour time to 24-hour format
  const convertTo24Hour = (time12h: string) => {
    const [time, modifier] = time12h.split(" ");
    let [hours] = time.split(":");
    const [, minutes] = time.split(":");
    if (hours === "12") {
      hours = "00";
    }
    if (modifier === "PM") {
      hours = (parseInt(hours, 10) + 12).toString();
    }
    return `${hours.padStart(2, "0")}:${minutes}`;
  };

  // Get default date (today)
  const getDefaultDate = () => {
    const now = new Date();
    return now.toISOString().split("T")[0]; // YYYY-MM-DD format
  };

  // Get default time in 12-hour format
  const getDefaultTime = () => {
    const now = new Date();
    const currentMinutes = now.getMinutes();

    // Round up to next convenient time slot
    if (currentMinutes < 15) {
      now.setMinutes(30);
    } else if (currentMinutes < 30) {
      now.setMinutes(30);
    } else if (currentMinutes < 45) {
      now.setHours(now.getHours() + 1);
      now.setMinutes(0);
    } else {
      now.setHours(now.getHours() + 1);
      now.setMinutes(0);
    }

    // Convert to 12-hour format
    const hour = now.getHours();
    const minute = now.getMinutes();
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    const minuteStr = minute.toString().padStart(2, "0");

    return `${hour12}:${minuteStr} ${ampm}`;
  };

  const initialValues = {
    title: "",
    eventDate: getDefaultDate(),
    eventTime: getDefaultTime(),
  };

  const handleSubmit = async (values: {
    title: string;
    eventDate: string;
    eventTime: string;
  }) => {
    toast.dismiss("create-event-loading");

    const toastId = toast.loading("Creating your event...", {
      id: "create-event-loading",
      style: {
        background: "#3b82f6",
        color: "#fff",
      },
    });

    try {
      const time24h = convertTo24Hour(values.eventTime);
      const combinedDateTime = `${values.eventDate}T${time24h}:00`;

      const { data } = await createEvent({
        variables: {
          input: {
            title: values.title,
            date: new Date(combinedDateTime).toISOString(),
          },
        },
      });

      if (data?.createEvent) {
        toast.success("🎉 Event created successfully!", {
          id: toastId,
        });
        router.push(`/events/${data.createEvent.id}`);
      }
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto w-full">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid }) => (
          <Form className="space-y-4 sm:space-y-6">
            <div className="space-y-4 sm:space-y-6">
              <Field name="title">
                {({ field, meta }: FormikFieldProps) => (
                  <Input
                    {...field}
                    type="text"
                    label="Event Title"
                    placeholder="Enter a memorable event title"
                    error={meta.touched && meta.error ? meta.error : undefined}
                  />
                )}
              </Field>

              <Field name="eventDate">
                {({ field, meta }: FormikFieldProps) => (
                  <Input
                    {...field}
                    type="date"
                    label="Event Date"
                    min={getDefaultDate()}
                    error={meta.touched && meta.error ? meta.error : undefined}
                  />
                )}
              </Field>

              <Field name="eventTime">
                {({ field, meta }: FormikFieldProps) => (
                  <Select
                    {...field}
                    label="Event Time"
                    error={meta.touched && meta.error ? meta.error : undefined}
                    helperText="📅 Time is automatically set to the next convenient slot"
                  >
                    {generateTimeOptions().map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4 mt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                className="w-full sm:flex-1 min-h-[44px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={!isValid}
                isLoading={isSubmitting || loading}
                className="w-full sm:flex-1 min-h-[44px]"
              >
                {isSubmitting || loading ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
