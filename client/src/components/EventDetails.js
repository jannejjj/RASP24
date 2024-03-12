import React from "react";
import { Grid } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import "../App.css";
import "../styles/EventDetails.css";

function EventDetails(props) {

  const [startYear, startMonth, startDay] = props.startDate.split("T")[0].split("-")
  const startTime = props.startDate.split("T")[1].slice(0, 5)
  
  const [endYear, endMonth, endDay] = props.endDate ? props.endDate.split("T")[0].split("-") : ["","",""]
  const endTime = props.endDate ? props.endDate.split("T")[1].slice(0, 5) : ""

  const [deadlineYear, deadlineMonth, deadlineDay] = props.joinDeadline.split("T")[0].split("-")
  const deadlineTime = props.joinDeadline.split("T")[1].slice(0, 5)
  return (
    <Grid container rowSpacing={2} columns={2} columnSpacing={16} justifyContent={"center"} fontFamily={"Poppins"}>
      <Grid item xs={2} md={1} className="details-grid-item">
        <AccessTimeIcon/>
        <span>Start time: {startDay}.{startMonth}.{startYear} {startTime}</span>
      </Grid>
      <Grid item xs={2} md={1} className="details-grid-item">
        <LocalOfferIcon />
        <span>Price: {props.price}€</span>
      </Grid>
      <Grid item xs={2} md={1} className="details-grid-item">
        <AccessTimeIcon />
        {props.endDate ? <span>End time: {endDay}.{endMonth}.{endYear} {endTime}</span> : <span>End time: Not specified</span>}
        
      </Grid>
      <Grid item xs={2} md={1} className="details-grid-item">
        <PeopleAltIcon />
        <span>Attendees: {props.attendees}</span>
      </Grid>
      <Grid item xs={2} md={1} className="details-grid-item">
        <EventIcon />
        <span>Deadline: {deadlineDay}.{deadlineMonth}.{deadlineYear} {deadlineTime}</span>
      </Grid>
      <Grid item xs={2} md={1} className="details-grid-item">
        <LocalActivityIcon />
        <span>Tickets: {props.tickets ? props.tickets : "Unlimited"}</span>
      </Grid>

      <Grid item xs={2}>
        <div style={{
          display:"flex",
          height: "100px",
          width: "100%",
          backgroundColor: "pink",
          margin: "auto",
          alignItems: "center",
          justifyContent: "center",
        border: "1px solid black",}}
        >
            Map goes here, maybe
        </div>
      </Grid>
    </Grid>
  );
}

export default EventDetails;