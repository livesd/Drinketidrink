import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/react";
import { vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FilterPanel from "../components/FilterBar";

// Mock the hooks and API functions
vi.mock("../hooks/useSessionStorage", () => ({
  useSessionStorage: vi.fn((_: string, initial: string) => [initial, vi.fn()]),
}));

vi.mock("../api/cocktails", () => ({
  getAlcoholicOptions: vi.fn(() =>
    Promise.resolve(["Alcoholic", "Non alcoholic", "Optional alcohol"]),
  ),
}));

// Mock useQuery - define the mock function inside the factory
vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQuery: vi.fn(() => ({
      data: ["Alcoholic", "Non alcoholic", "Optional alcohol"],
      isLoading: false,
      isError: false,
    })),
  };
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

test("FilterPanel matches snapshot with default state", () => {
  const mockOnFiltersChange = vi.fn();

  const { container } = render(
    <FilterPanel onFiltersChange={mockOnFiltersChange} />,
    { wrapper: createWrapper() },
  );

  expect(container.firstChild).toMatchSnapshot();
});

test("FilterPanel matches snapshot with loading state", async () => {
  // Import and override the mock for this test
  const { useQuery } = await import("@tanstack/react-query");
  vi.mocked(useQuery).mockReturnValueOnce({
    data: undefined,
    isLoading: true,
    isError: false,
  } as any);

  const mockOnFiltersChange = vi.fn();

  const { container } = render(
    <FilterPanel onFiltersChange={mockOnFiltersChange} />,
    { wrapper: createWrapper() },
  );

  expect(container.firstChild).toMatchSnapshot();
});

test("FilterPanel matches snapshot with error state", async () => {
  // Import and override the mock for this test
  const { useQuery } = await import("@tanstack/react-query");
  vi.mocked(useQuery).mockReturnValueOnce({
    data: undefined,
    isLoading: false,
    isError: true,
  } as any);

  const mockOnFiltersChange = vi.fn();

  const { container } = render(
    <FilterPanel onFiltersChange={mockOnFiltersChange} />,
    { wrapper: createWrapper() },
  );

  expect(container.firstChild).toMatchSnapshot();
});
