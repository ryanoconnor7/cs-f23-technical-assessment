import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import DatePicker from "./components/DatePicker";
import moment from "moment";
import styled from "styled-components";
import { pick } from "lodash";

/**
 * An example of a dummy form component to create an event, with two date fields.
 *
 * These date fields popup a date picker on click.
 */
function App() {
  const [startPickerVisible, setStartPickerVisible] = useState<boolean>(false);
  const [endPickerVisible, setEndPickerVisible] = useState<boolean>(false);
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());

  return (
    <div className="App">
      <header className="App-header">
        <FormContainer>
          <FieldContainer style={{ pointerEvents: "none", opacity: 0.5 }}>
            <Title>Event Name</Title>
            <Button>
              <ButtonText>AYC Distance Race</ButtonText>
            </Button>
          </FieldContainer>
          <FieldContainer style={{ pointerEvents: "none", opacity: 0.5 }}>
            <Title>Location</Title>
            <Button>
              <ButtonText>American Yacht Club</ButtonText>
            </Button>
          </FieldContainer>
          <FieldContainer onClick={() => setStartPickerVisible(true)}>
            <Title>Start Date</Title>
            <Button>
              <ButtonText>{startDate.format("L")}</ButtonText>
            </Button>
            <DatePicker
              visible={startPickerVisible}
              initialDate={startDate}
              onDismiss={() => setStartPickerVisible(false)}
              onDateChange={(d) => setStartDate(d)}
            />
          </FieldContainer>
          <FieldContainer>
            <Title>End Date</Title>
            <Button onClick={() => setEndPickerVisible(true)}>
              <ButtonText>{endDate.format("L")}</ButtonText>
            </Button>
            <DatePicker
              visible={endPickerVisible}
              initialDate={endDate}
              onDismiss={() => setEndPickerVisible(false)}
              onDateChange={(d) => setEndDate(d)}
            />
          </FieldContainer>
          <FieldContainer style={{ pointerEvents: "none", opacity: 0.5 }}>
            <Title>Max Participants</Title>
            <Button>
              <ButtonText>10</ButtonText>
            </Button>
          </FieldContainer>
          <FieldContainer style={{ pointerEvents: "none", opacity: 0.5 }}>
            <Title>Description</Title>
            <Button>
              <ButtonText>
                {
                  "We're very excited to host the 30th annual AYC Distance Race.\nProgramming will begin on Thursday evening at..."
                }
              </ButtonText>
            </Button>
          </FieldContainer>
        </FormContainer>
      </header>
    </div>
  );
}

export default App;

const FormContainer = styled.div`
  position: relative;
  padding-left: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: auto;
`;

const FieldContainer = styled.div`
  position: relative;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Title = styled.h5`
  color: black;
  margin-bottom: 8px;
`;
const Button = styled.div`
  :hover {
    background-color: rgba(0, 0, 200, 0.1);
  }
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  border: solid 2px rgba(0, 0, 0, 0.25);
  margin-right: auto;
`;
const ButtonText = styled.p`
  padding: 8px 6px;
  color: black;
  margin: 0px;
  font-weight: 500;
  letter-spacing: 0.1em;
  font-size: 20px;
  min-width: 80px;
  max-width: 350px;
  text-align: left;
`;
