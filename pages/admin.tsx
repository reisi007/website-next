import { AdminPage } from '../components/AdminPage';
import { CalendarWithSlider } from '../components/admin/calendar/CalendarWithSlider';
import { Loadable } from '../components/images-next/host/Loadable';
import { usePrivateCalendarData } from '../components/admin/calendar/calendar.api';

export default function AdminLoginScreen() {
  return (
    <AdminPage title="Kalender">
      { (jwt) => <Calendar jwt={jwt} /> }
    </AdminPage>
  );
}

function Calendar({ jwt }:{ jwt:string }) {
  return (
    <Loadable {...(usePrivateCalendarData(jwt))}>
      { (data) => <CalendarWithSlider className="py-2" data={data} />}
    </Loadable>
  );
}
