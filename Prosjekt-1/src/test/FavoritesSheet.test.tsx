import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FavoritesSheet from "../components/FavoritesSheet";

describe("FavoritesSheet", () => {
  const favs = [
    { id: "11000", name: "Mojito" },
    { id: "17222", name: "A1" },
  ];

  it("renders empty state when no favorites", () => {
    const onClose = vi.fn();
    const onSelect = vi.fn();
    const onToggle = vi.fn();

    const { container } = render(
      <FavoritesSheet
        open={true}
        favorites={[]}
        onClose={onClose}
        onSelect={onSelect}
        onToggleFavorite={onToggle}
      />
    );

    expect(screen.getByText(/no favorites yet/i)).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });

  it("applies 'open' classes and aria attributes when open=true", () => {
    const { container } = render(
      <FavoritesSheet
        open={true}
        favorites={favs}
        onClose={vi.fn()}
        onSelect={vi.fn()}
        onToggleFavorite={vi.fn()}
      />
    );

    const dialog = screen.getByRole("dialog", {
      name: /favorites notepad/i,
      hidden: true,
    });
    expect(dialog).toHaveClass("open");

    const backdrop = container.querySelector(".sheet-backdrop");
    expect(backdrop).toHaveClass("open");
    expect(backdrop).toHaveAttribute("aria-hidden", "false");
  });

  it("does not apply 'open' class when open=false", () => {
    const { container } = render(
      <FavoritesSheet
        open={false}
        favorites={favs}
        onClose={vi.fn()}
        onSelect={vi.fn()}
        onToggleFavorite={vi.fn()}
      />
    );

    // When closed, the sheet is inside aria-hidden backdrop, so include hidden nodes
    const dialog = screen.getByRole("dialog", {
      name: /favorites notepad/i,
      hidden: true,
    });
    expect(dialog).not.toHaveClass("open");

    const backdrop = container.querySelector(".sheet-backdrop");
    expect(backdrop).not.toHaveClass("open");
    expect(backdrop).toHaveAttribute("aria-hidden", "true");
  });

  it("closes on Escape key", () => {
    const onClose = vi.fn();
    render(
      <FavoritesSheet
        open={true}
        favorites={favs}
        onClose={onClose}
        onSelect={vi.fn()}
        onToggleFavorite={vi.fn()}
      />
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes when clicking outside (backdrop/body)", () => {
    const onClose = vi.fn();
    render(
      <FavoritesSheet
        open={true}
        favorites={favs}
        onClose={onClose}
        onSelect={vi.fn()}
        onToggleFavorite={vi.fn()}
      />
    );

    fireEvent.mouseDown(document.body);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when clicking inside the sheet", () => {
    const onClose = vi.fn();
    render(
      <FavoritesSheet
        open={true}
        favorites={favs}
        onClose={onClose}
        onSelect={vi.fn()}
        onToggleFavorite={vi.fn()}
      />
    );

    const dialog = screen.getByRole("dialog", { name: /favorites notepad/i });
    fireEvent.mouseDown(dialog);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not close when clicking the hamburger button", () => {
    const onClose = vi.fn();

    const hamburger = document.createElement("button");
    hamburger.className = "hamburger";
    document.body.appendChild(hamburger);

    render(
      <FavoritesSheet
        open={true}
        favorites={favs}
        onClose={onClose}
        onSelect={vi.fn()}
        onToggleFavorite={vi.fn()}
      />
    );

    fireEvent.mouseDown(hamburger);
    expect(onClose).not.toHaveBeenCalled();

    document.body.removeChild(hamburger);
  });

  it("selects a favorite and closes", () => {
    const onClose = vi.fn();
    const onSelect = vi.fn();
    render(
      <FavoritesSheet
        open={true}
        favorites={favs}
        onClose={onClose}
        onSelect={onSelect}
        onToggleFavorite={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Mojito" }));
    expect(onSelect).toHaveBeenCalledWith("11000");
    expect(onClose).toHaveBeenCalled();
  });

  it("removes a favorite via remove button", () => {
    const onToggle = vi.fn();
    render(
      <FavoritesSheet
        open={true}
        favorites={favs}
        onClose={vi.fn()}
        onSelect={vi.fn()}
        onToggleFavorite={onToggle}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: /remove mojito from favorites/i })
    );
    expect(onToggle).toHaveBeenCalledWith("11000", "Mojito");
  });

  it("close button triggers onClose", () => {
    const onClose = vi.fn();
    render(
      <FavoritesSheet
        open={true}
        favorites={favs}
        onClose={onClose}
        onSelect={vi.fn()}
        onToggleFavorite={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("matches snapshot when open with favorites", () => {
    const { container } = render(
      <FavoritesSheet
        open={true}
        favorites={favs}
        onClose={vi.fn()}
        onSelect={vi.fn()}
        onToggleFavorite={vi.fn()}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
