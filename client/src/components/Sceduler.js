import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from "moment";

const localizer = momentLocalizer(moment);

function SchedulerComponent(props) {
  return (
    <div className="myCustomHeight">
    <Calendar
      localizer={localizer}
      // events={myEventsList}
      startAccessor="start"
      endAccessor="end"
    />
  </div>
  );
}

export default SchedulerComponent;