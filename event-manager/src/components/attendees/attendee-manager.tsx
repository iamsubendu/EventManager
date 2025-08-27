"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Formik, Form, Field, ErrorMessage } from "formik";
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Attendees ({attendees.length})
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="w-4 h-4 mr-1" />
          Add Attendee
        </button>
      </div>

      {showForm && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
          <Formik
            initialValues={initialValues}
            validationSchema={createValidationSchema(attendees)}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-800 mb-2"
                  >
                    👤 Attendee Name *
                  </label>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    className="block w-full px-4 py-3 border border-blue-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 focus:bg-white text-gray-700"
                    placeholder="Enter attendee's full name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="mt-2 text-sm text-red-600 flex items-center"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-800 mb-2"
                  >
                    📧 Email Address (optional)
                  </label>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    className="block w-full px-4 py-3 border border-blue-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 focus:bg-white text-gray-700"
                    placeholder="attendee@example.com"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="mt-2 text-sm text-red-600 flex items-center"
                  />
                  <p className="mt-2 text-xs text-blue-600">
                    💡 Each email can only be used once per event
                  </p>
                </div>

                <div className="flex space-x-4 pt-4 border-t border-blue-100">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 px-6 border border-blue-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || creating}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 disabled:hover:transform-none"
                  >
                    {isSubmitting || creating ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        Adding...
                      </span>
                    ) : (
                      "Add Attendee"
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}

      {attendees.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No attendees yet. Add the first one!</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {attendees.map((attendee) => (
              <li key={attendee.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900">
                        {attendee.name}
                      </p>
                      {attendee.email && (
                        <p className="ml-2 text-sm text-gray-500">
                          ({attendee.email})
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Added {new Date(attendee.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(attendee.id, attendee.name)}
                    className="ml-4 p-1 text-red-600 hover:text-red-800 focus:outline-none"
                    title="Remove attendee"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
