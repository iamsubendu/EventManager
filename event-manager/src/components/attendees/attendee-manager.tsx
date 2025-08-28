"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import {
  CREATE_ATTENDEE,
  DELETE_ATTENDEE,
  GET_EVENT,
} from "@/lib/graphql/queries";
import { Attendee, CreateAttendeeInput } from "@/lib/types";
import { PlusIcon, TrashIcon } from "@/components/ui/icons";
import { getErrorMessage } from "@/lib/error-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface FormikFieldProps {
  field: {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  };
  meta: {
    touched: boolean;
    error?: string;
  };
}

interface Props {
  eventId: string;
  attendees: Attendee[];
}

const createValidationSchema = (existingAttendees: Attendee[]) =>
  Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),
    email: Yup.string()
      .email("Invalid email format")
      .test(
        "unique-email",
        "This email is already registered for this event",
        function (value) {
          if (!value) return true; // Allow empty emails
          const emailExists = existingAttendees.some(
            (attendee) => attendee.email?.toLowerCase() === value.toLowerCase()
          );
          return !emailExists;
        }
      )
      .nullable(),
  });

export function AttendeeManager({ eventId, attendees }: Props) {
  const [showForm, setShowForm] = useState(false);

  const [createAttendee, { loading: creating }] = useMutation(CREATE_ATTENDEE, {
    refetchQueries: [{ query: GET_EVENT, variables: { id: eventId } }],
  });

  const [deleteAttendee] = useMutation(DELETE_ATTENDEE, {
    refetchQueries: [{ query: GET_EVENT, variables: { id: eventId } }],
  });

  const initialValues: CreateAttendeeInput = {
    name: "",
    email: "",
    eventId,
  };

  const handleSubmit = async (
    values: CreateAttendeeInput,
    { resetForm }: { resetForm: () => void }
  ) => {
    // Dismiss any existing toasts for this action
    toast.dismiss("add-attendee-loading");

    const toastId = toast.loading("Adding attendee...", {
      id: "add-attendee-loading",
      style: {
        background: "#3b82f6",
        color: "#fff",
      },
    });

    try {
      await createAttendee({
        variables: {
          input: {
            name: values.name,
            email: values.email || undefined,
            eventId,
          },
        },
      });

      toast.success(`✅ ${values.name} added successfully!`, {
        id: toastId,
      });

      resetForm();
      setShowForm(false);
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    }
  };

  const handleDelete = async (attendeeId: string, attendeeName: string) => {
    const confirmed = await new Promise((resolve) => {
      toast(
        (t) => (
          <div className="flex flex-col space-y-3">
            <div>
              <p className="font-medium text-gray-900">Remove Attendee</p>
              <p className="text-sm text-gray-600">
                Are you sure you want to remove <strong>{attendeeName}</strong>{" "}
                from this event?
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(false);
                }}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(true);
                }}
                className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ),
        {
          duration: Infinity,
          style: {
            maxWidth: "400px",
          },
        }
      );
    });

    if (confirmed) {
      // Dismiss any existing toasts for this action
      toast.dismiss(`remove-attendee-${attendeeId}`);

      const toastId = toast.loading("Removing attendee...", {
        id: `remove-attendee-${attendeeId}`,
        style: {
          background: "#ef4444",
          color: "#fff",
        },
      });

      try {
        await deleteAttendee({
          variables: { id: attendeeId },
        });

        toast.success(`🗑️ ${attendeeName} removed successfully`, {
          id: toastId,
        });
      } catch (error) {
        toast.error(getErrorMessage(error), {
          id: toastId,
        });
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-base sm:text-lg font-medium text-gray-900">
          Attendees ({attendees.length})
        </h3>
        <Button
          variant="ghost"
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-100 hover:bg-blue-200"
        >
          <PlusIcon className="w-4 h-4 mr-1" />
          Add Attendee
        </Button>
      </div>

      {showForm && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <Formik
            initialValues={initialValues}
            validationSchema={createValidationSchema(attendees)}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4 sm:space-y-6">
                <Field name="name">
                  {({ field, meta }: FormikFieldProps) => (
                    <Input
                      {...field}
                      type="text"
                      label="👤 Attendee Name *"
                      placeholder="Enter attendee's full name"
                      className="border-blue-200 bg-white/80 focus:bg-white"
                      error={
                        meta.touched && meta.error ? meta.error : undefined
                      }
                    />
                  )}
                </Field>

                <Field name="email">
                  {({ field, meta }: FormikFieldProps) => (
                    <Input
                      {...field}
                      type="email"
                      label="📧 Email Address (optional)"
                      placeholder="attendee@example.com"
                      className="border-blue-200 bg-white/80 focus:bg-white"
                      error={
                        meta.touched && meta.error ? meta.error : undefined
                      }
                      helperText="💡 Each email can only be used once per event"
                    />
                  )}
                </Field>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-blue-100">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowForm(false)}
                    className="w-full sm:flex-1 border-blue-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting || creating}
                    isLoading={isSubmitting || creating}
                    className="w-full sm:flex-1"
                  >
                    {isSubmitting || creating ? "Adding..." : "Add Attendee"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card>
      )}

      {attendees.length === 0 ? (
        <div className="text-center py-6 sm:py-8 text-gray-500">
          <p className="text-sm sm:text-base">
            No attendees yet. Add the first one!
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg sm:rounded-xl">
          <ul className="divide-y divide-gray-200">
            {attendees.map((attendee) => (
              <li key={attendee.id} className="px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex items-start sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {attendee.name}
                      </p>
                      {attendee.email && (
                        <p className="text-xs sm:text-sm text-gray-500 truncate">
                          ({attendee.email})
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Added {new Date(attendee.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(attendee.id, attendee.name)}
                    className="flex-shrink-0 text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5"
                    title="Remove attendee"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
