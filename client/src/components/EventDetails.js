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

  const localeStringOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Helsinki"
  }

  const localizedStartDate = new Date(props.startDate).toLocaleString("fi-FI", localeStringOptions);
  const localizedEndDate = props.endDate ? new Date(props.endDate).toLocaleString("fi-FI", localeStringOptions) : "Not specified";
  const localizedDeadline = new Date(props.joinDeadline).toLocaleString("fi-FI", localeStringOptions);

  return (
    <div class="EventDetailsSection">
    <Grid  container rowSpacing={2} columns={2} columnSpacing={16} justifyContent={"center"} fontFamily={"Poppins"} >
      <Grid item xs={2} md={1} className="details-grid-item">
        <AccessTimeIcon/>
        <span>Start: {localizedStartDate}</span>
      </Grid>
      <Grid item xs={2} md={1} className="details-grid-item">
        <LocalOfferIcon />
        <span>Price: {props.price}€</span>
      </Grid>
      <Grid item xs={2} md={1} className="details-grid-item">
        <AccessTimeIcon />
        <span>End: {localizedEndDate}</span>
      </Grid>
      <Grid item xs={2} md={1} className="details-grid-item">
        <PeopleAltIcon />
        <span>Tickets sold: {props.ticketsSold}</span>
      </Grid>
      <Grid item xs={2} md={1} className="details-grid-item">
        <EventIcon />
        <span>Join by: {localizedDeadline}</span>
      </Grid>
      <Grid item xs={2} md={1} className="details-grid-item">
        <LocalActivityIcon />
        <span>Total tickets: {props.tickets ? props.tickets : "Unlimited"}</span>
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
            Map goes here
        </div>
      </Grid>
    </Grid>

    </div>
  );
}

export default EventDetails;