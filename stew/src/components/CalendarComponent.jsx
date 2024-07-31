import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const familyMembersCount = 4; // 예시: 실제 데이터로 설정해야 함

const CalendarComponent = ({ accessToken }) => {
  const [activityData, setActivityData] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/accounts/13/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const tempActivityData = {};
        response.data.states.forEach((state) => {
          const date = new Date(state.created_at).getDate();
          tempActivityData[date] = (tempActivityData[date] || 0) + 1;
        });
        setActivityData(tempActivityData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [accessToken]);

  const getColorForDay = (day) => {
    const activityCount = activityData[day] || 0;
    const opacity = (activityCount / familyMembersCount) * 100;
    return `rgba(255, 125, 0, ${opacity / 100})`;
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      2
    );
    if (newDate >= new Date().setDate(1)) {
      setCurrentDate(newDate);
    }
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<EmptyDay key={`empty-${i}`} />);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(
      <Day key={i} color={getColorForDay(i)}>
        {i}
        {activityData[i] === familyMembersCount && <Heart>🧡</Heart>}
      </Day>
    );
  }

  return (
    <CalendarWrapper>
      <MonthYear>
        <Arrow
          onClick={handlePrevMonth}
          disabled={
            new Date(currentDate.getFullYear(), currentDate.getMonth(), 1) <=
            new Date().setDate(1)
          }
        >
          {"<"}
        </Arrow>
        {year}.{String(month + 1).padStart(2, "0")}
        <Arrow onClick={handleNextMonth}>{">"}</Arrow>
      </MonthYear>
      <DaysWrapper>
        <WeeksWrapper>
          <WeekDay>일</WeekDay>
          <WeekDay>월</WeekDay>
          <WeekDay>화</WeekDay>
          <WeekDay>수</WeekDay>
          <WeekDay>목</WeekDay>
          <WeekDay>금</WeekDay>
          <WeekDay>토</WeekDay>
        </WeeksWrapper>
        {days}
      </DaysWrapper>
    </CalendarWrapper>
  );
};

export default CalendarComponent;

const CalendarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-radius: 21px;
  padding: 13px;
  padding-top: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const MonthYear = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #222222;
  font-weight: 400;
`;

const Arrow = styled.div`
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  margin: 0 40px;
  background-color: ${(props) => (props.disabled ? "#E2E2E2" : "transparent")};
  border: 2px solid #e2e2e2;
  border-radius: 50%;
  padding: 2px 6.5px 3px 7px;
  font-weight: 200;
`;

const DaysWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  font-size: 14px;
  color: #222222;
  font-weight: 100;
  margin-left: 8px;
`;

const WeeksWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  font-size: 14px;
  color: #222222;
  margin-right: -16px;
`;

const Day = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin: 2px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  color: black;
  font-weight: 400;
`;

const EmptyDay = styled.div`
  width: 40px;
  height: 40px;
  margin: 2px;
`;

const WeekDay = styled.div`
  width: 40px;
  height: 40px;
  margin: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
`;

const Heart = styled.div`
  font-size: 12px;
  margin-top: 5px;
`;
