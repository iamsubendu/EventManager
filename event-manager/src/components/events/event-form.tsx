"use client";

import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { CREATE_EVENT, GET_EVENTS } from "@/lib/graphql/queries";
import { CreateEventInput } from "@/lib/types";
import { getErrorMessage } from "@/lib/error-utils";

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Event title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  date: Yup.date()
    .required("Event date is required")
    .min(
      new Date(new Date().setDate(new Date().getDate() + 1)),
      "Event date must be at least tomorrow"
    ),
});

export function EventForm() {
  const router = useRouter();
  const [createEvent, { loading }] = useMutation(CREATE_EVENT, {
    refetchQueries: [{ query: GET_EVENTS }],
  });

  // Get minimum date (tomorrow) in the correct format for datetime-local
  const getMinDateTime = () => {
    const now = new Date();
    now.setDate(now.getDate() + 1); // Tomorrow
    return now.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
  };

  const initialValues: CreateEventInput = {
    title: "",
    date: "",
  };

  const handleSubmit = async (values: CreateEventInput) => {
    // Dismiss any existing toasts for this action
    toast.dismiss("create-event-loading");

    const toastId = toast.loading("Creating your event...", {
      id: "create-event-loading",
      style: {
        background: "#3b82f6",
        color: "#fff",
      },
    });

    try {
      const { data } = await createEvent({
        variables: {
          input: {
            title: values.title,
            date: new Date(values.date).toISOString(),
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
    <div className="max-w-lg mx-auto">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid }) => (
          <Form className="space-y-8">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Event Title
                </label>
                <Field
                  type="text"
                  name="title"
                  id="title"
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Enter a memorable event title"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="mt-2 text-sm text-red-600 flex items-center"
                />
              </div>

              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Event Date & Time
                </label>
                <div className="relative">
                  <Field
                    type="datetime-local"
                    name="date"
                    id="date"
                    min={getMinDateTime()}
                    className="block w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-gray-700"
                    style={{
                      colorScheme: "light",
                    }}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <ErrorMessage
                  name="date"
                  component="div"
                  className="mt-2 text-sm text-red-600 flex items-center"
                />
                <p className="mt-2 text-xs text-gray-500">
                  📅 Choose when your event will take place (must be in the
                  future)
                </p>
              </div>
            </div>

            <div className="flex space-x-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 px-6 border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || loading || !isValid}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 disabled:hover:transform-none"
              >
                {isSubmitting || loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  "Create Event"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
