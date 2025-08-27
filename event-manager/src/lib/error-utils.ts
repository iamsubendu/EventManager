import { ApolloError } from "@apollo/client";

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApolloError) {
    // GraphQL errors
    if (error.graphQLErrors?.length > 0) {
      return error.graphQLErrors[0].message;
    }

    // Network errors
    if (error.networkError) {
      return "Network error. Please check your connection and try again.";
    }

    // Generic Apollo error
    return error.message || "An unexpected error occurred.";
  }

  // Generic error handling
  if (error instanceof Error) {
    return error.message;
  }

  // Fallback for unknown error types
  return "An unexpected error occurred. Please try again.";
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof ApolloError && !!error.networkError;
}

export function isGraphQLError(error: unknown): boolean {
  return error instanceof ApolloError && error.graphQLErrors?.length > 0;
}
