import { render, screen } from "@testing-library/react";
import { ExternalLink } from "src/components/ExternalLink";

test('has target="_blank"', () => {
  render(<ExternalLink href="/">target</ExternalLink>);

  expect(screen.getByRole("link")).toHaveAttribute("target", "_blank");
});

test('has rel="noreferrer noopener"', () => {
  render(<ExternalLink href="/">target</ExternalLink>);

  expect(screen.getByRole("link")).toHaveAttribute(
    "rel",
    "noopener noreferrer"
  );
});
