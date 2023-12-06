import moment from "moment";
import styled from "styled-components";
import { ArrowDown } from "./icons/Chevrons";

/**
 * Monthy helper component for the Date Picker.
 *
 * On mobile, this is a non-touchable label for the current month.
 *
 * On desktop, this is a single-select drop down to select another month.
 */
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface Props {
  month: number; // [1, 12]
  onMonthChange: (month: number) => void;
}

const MonthPicker = (props: Props) => {
  const isMobile = window.innerWidth < 500;
  const displayMonth = moment(props.month, "M").format("MMMM");

  return isMobile ? (
    <Month>{displayMonth}</Month>
  ) : (
    <MonthButtonWrapper>
      <MonthButton>
        <Month>{displayMonth}</Month>
        <ArrowDown />
      </MonthButton>
      <MonthSelect
        onChange={(e) =>
          props.onMonthChange(
            MONTHS.findIndex((m) => m === e.currentTarget.value) + 1
          )
        }
      >
        {displayMonth}
        {MONTHS.map((monthOption) => (
          <MonthOption
            value={monthOption}
            selected={monthOption === displayMonth}
          >
            {monthOption}
          </MonthOption>
        ))}
      </MonthSelect>
    </MonthButtonWrapper>
  );
};

export default MonthPicker;

const Month = styled.p`
  font-size: 19px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin: 0px;
  margin-right: 6px;
  user-select: none;
`;
const MonthButtonWrapper = styled.div`
  position: relative;
`;
const MonthSelect = styled.select`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
`;
const MonthButton = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 19px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin: 0px;
  margin-right: 6px;
  user-select: none;
  pointer-events: none;
`;
const MonthOption = styled.option``;
