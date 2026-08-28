"""Simple interest calculator.

Formula: simple interest = principal * annual rate * time in years.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class InterestResult:
    """The calculated interest and final balance."""

    principal: float
    interest: float
    total: float
    years: float


def calculate_simple_interest(
    principal: float, annual_rate: float, time: float, unit: str = "years"
) -> InterestResult:
    """Calculate simple interest for a principal, rate, and time period."""
    if principal < 0:
        raise ValueError("Principal cannot be negative.")
    if annual_rate < 0:
        raise ValueError("Annual interest rate cannot be negative.")
    if time < 0:
        raise ValueError("Time period cannot be negative.")
    if unit not in {"years", "months"}:
        raise ValueError("Unit must be 'years' or 'months'.")

    years = time / 12 if unit == "months" else time
    interest = principal * (annual_rate / 100) * years
    return InterestResult(principal, interest, principal + interest, years)


def compare_scenarios(
    principal: float,
    first_rate: float,
    first_time: float,
    second_rate: float,
    second_time: float,
) -> float:
    """Return how much more interest scenario two earns than scenario one."""
    first = calculate_simple_interest(principal, first_rate, first_time).interest
    second = calculate_simple_interest(principal, second_rate, second_time).interest
    return second - first


def read_number(prompt: str) -> float:
    """Read a non-negative number from the terminal."""
    while True:
        try:
            value = float(input(prompt))
            if value < 0:
                raise ValueError
            return value
        except ValueError:
            print("Please enter a non-negative number.")


def main() -> None:
    print("Simple Interest Calculator")
    print("Formula: I = P x r x t\n")

    principal = read_number("Principal amount: $")
    annual_rate = read_number("Annual interest rate: ")
    unit = input("Time unit (years/months) [years]: ").strip().lower() or "years"
    while unit not in {"years", "months"}:
        print("Please enter years or months.")
        unit = input("Time unit (years/months) [years]: ").strip().lower() or "years"
    time = read_number(f"Time period in {unit}: ")

    result = calculate_simple_interest(principal, annual_rate, time, unit)
    yearly_interest = result.interest / result.years if result.years else 0

    print("\nResult")
    print(f"Interest earned: ${result.interest:,.2f}")
    print(f"Final balance:   ${result.total:,.2f}")
    print(f"Average per year: ${yearly_interest:,.2f}")


if __name__ == "__main__":
    main()
