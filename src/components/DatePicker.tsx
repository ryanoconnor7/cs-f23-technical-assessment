import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import _, { first } from "lodash";
import { ChevronLeft, ChevronRight } from "./icons/Chevrons";
import MonthPicker from "./MonthPicker";

/**
 * Pop-up Date Picker component.
 *
 * This component renders a placeholder invisible view which is the location of the popup. The popup is rendered absolutely, and presented when `visible` is true. This component can call `onDismiss` to request closing.
 */
interface Props {
  visible: boolean;
  initialDate: moment.Moment;
  onDismiss: () => void;
  onDateChange: (date: moment.Moment) => void;
}

type Day = string;
type Week = Day[];

const DATE_FORMAT = "M-D-YYYY";

const DatePicker = (props: Props) => {
  const [selectedDate, setSelectedDate] = useState(props.initialDate);
  const [month, setMonth] = useState(props.initialDate.month() + 1); // [1, 12]
  const [year, setYear] = useState(props.initialDate.year());

  /**
   * Listen for click/touches outside of the date picker, and when this happens request to close with `onDismiss`.
   */
  const containerRef = useRef<any>(null);
  useEffect(() => {
    const dismissIfOutside = (e: any) => {
      if (containerRef.current?.contains(e.target) !== true) {
        props.onDismiss();
      }
    };

    document.addEventListener("mousedown", dismissIfOutside);
    return () => document.removeEventListener("mousedown", dismissIfOutside);
  }, []);

  const moveForward = useCallback(() => {
    let nextMonth = month + 1;
    let nextYear = year;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear = year + 1;
    }

    setMonth(nextMonth);
    setYear(nextYear);
  }, [year, month]);

  const moveBack = useCallback(() => {
    let nextMonth = month - 1;
    let nextYear = year;
    if (nextMonth < 1) {
      nextMonth = 12;
      nextYear = year - 1;
    }

    setMonth(nextMonth);
    setYear(nextYear);
  }, [year, month]);

  const weeks = useCallback(() => {
    let weeks: Week[] = [];
    const daysInMonth = moment(
      `${month}-01-${year}`,
      DATE_FORMAT
    ).daysInMonth();
    _.times(daysInMonth).forEach((day) => {
      const dayOfWeek = moment(
        `${month}-${day}-${year}`,
        DATE_FORMAT
      ).weekday();
      if (day == 1 && dayOfWeek > 0) {
        // Pad with empty days before month
        let firstWeek = _.times(dayOfWeek).map(() => "");
        weeks.push(firstWeek);
      } else if (dayOfWeek == 0) {
        weeks.push([]);
      }

      _.last(weeks)?.push(day.toString());

      if (day == daysInMonth - 1 && dayOfWeek < 6) {
        // Pad with empty days after month
        _.times(6 - dayOfWeek).forEach(() => _.last(weeks)?.push(""));
      }
    });

    return weeks;
  }, [year, month]);

  const dayIsSelected = useCallback(
    (day: string) => {
      return selectedDate.format(DATE_FORMAT) === `${month}-${day}-${year}`;
    },
    [month, year, selectedDate]
  );

  /**
   * On mobile, respond to swipe gestures (left and right) to change the month.
   */
  const [startScrollX, setStartScrollX] = useState<number | null>(null);
  const onTouchStart = useCallback((x: number) => setStartScrollX(x), []);
  const onTouchMove = useCallback(
    (x: number) => {
      if (!startScrollX) return;
      const currentScroll = x;
      if (startScrollX - currentScroll > 50) {
        moveForward();
        setStartScrollX(null);
      } else if (startScrollX - currentScroll < -50) {
        moveBack();
        setStartScrollX(null);
      }
    },
    [startScrollX]
  );

  const renderDayItem = (weekIndex: number, dayIndex: number, day: string) => {
    const isSelected = dayIsSelected(day);
    const isSelectable = !_.isEmpty(day);
    return (
      <DayItemButton
        key={`${weekIndex}-${dayIndex}`}
        onClick={
          isSelectable
            ? () => {
                const newDate = moment(`${month}-${day}-${year}`, DATE_FORMAT);
                setSelectedDate(newDate);
                props.onDateChange(newDate);
              }
            : undefined
        }
        style={{
          ...(isSelected
            ? {
                backgroundColor: "#0055b3",
              }
            : {}),
          ...(isSelectable
            ? { cursor: "pointer" }
            : { opacity: 0, cursor: "default" }),
        }}
      >
        <DayItem>
          <DayItemText
            style={
              isSelected
                ? {
                    color: "white",
                    fontWeight: "700",
                  }
                : {}
            }
          >
            {day}
          </DayItemText>
        </DayItem>
      </DayItemButton>
    );
  };

  if (!props.visible) return null;

  return (
    <Container ref={containerRef}>
      <Dialog
        onTouchStart={(e) => onTouchStart(e.targetTouches[0].clientX)}
        onTouchMove={(e) => onTouchMove(e.targetTouches[0].clientX)}
      >
        <HeaderRow>
          <MonthPicker month={month} onMonthChange={(m) => setMonth(m)} />
          <Year>{year}</Year>
          <div style={{ flex: 1 }} />

          <Arrow onClick={moveBack}>
            <ChevronLeft />
          </Arrow>
          <Arrow onClick={moveForward}>
            <ChevronRight />
          </Arrow>
        </HeaderRow>
        <DayRow>
          {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
            <DayHeader>{d}</DayHeader>
          ))}
        </DayRow>
        {weeks().map((week, wI) => (
          <DayRow key={`week-${wI}`}>
            {week.map((day, dI) => renderDayItem(wI, dI, day))}
          </DayRow>
        ))}
      </Dialog>
    </Container>
  );
};

export default DatePicker;

const Container = styled.div`
  position: relative;
  margin-top: 16px;
  margin-bottom: 16px;
`;
const Dialog = styled.div`
  box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  padding: 14px 16px 8px 16px;
  border-radius: 14px;
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  z-index: 1000;
  margin-bottom: 24px;
`;
const HeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0px 2px 0px 8px;
  margin-bottom: 8px;
  align-items: center;
`;

const Year = styled.p`
  font-size: 19px;
  font-weight: 600;
  margin: 0px;
  color: rgba(0, 0, 0, 0.6);
  user-select: none;
`;
const Arrow = styled.div`
  width: 28px;
  height: 28px;
  padding: 0px 2px;
  cursor: pointer;
  :hover {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 14px;
  }
`;
const DayRow = styled.p`
  display: flex;
  flex-direction: row;
  margin: 6px 0px;
`;
const DayHeader = styled.p`
  width: 16px;
  height: 18px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.6);
  font-size: 15px;
  line-height: 1rem;
  margin: 0px 10px;
  flex: 1;
  user-select: none;
`;

const DayItemButton = styled.div`
  :hover {
    border-radius: 15px;
    background-color: rgba(0, 0, 0, 0.1);
  }
  border-radius: 15px;
  margin-right: auto;
  margin-left: auto;
  flex-basis: 1;
  user-select: none;
`;
const DayItem = styled.div`
  :hover {
    background-color: rgba(0, 0, 0, 0);
  }
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
`;
const DayItemText = styled.p`
  vertical-align: center;
  font-weight: 600;
  color: rgba(0, 0, 0, 1);
  text-align: center;
  font-size: 15px;
  line-height: 1rem;
  margin: 0px;
  user-select: none;
`;
