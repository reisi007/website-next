import { AdminPage } from '../components/AdminPage';
import { CalendarWithSlider } from '../components/admin/calendar/CalendarWithSlider';
import { LoginResponse } from '../components/admin/AdminLoginForm';
import { Loadable } from '../components/images-next/host/Loadable';
import { usePrivateCalendarData } from '../components/admin/calendar/calendar.api';

export default function AdminLoginScreen() {
  return (
    <AdminPage title="Kalender">
      { (ld) => <Calendar {...ld} /> }
    </AdminPage>
  );
}

function Calendar(lr:LoginResponse) {
  return (
    <Loadable {...(usePrivateCalendarData(lr))}>
      { (data) => <CalendarWithSlider className="py-2" data={data} />}
    </Loadable>
  );
}
