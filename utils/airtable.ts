import Airtable from "airtable";

// Example URL: https://airtable.com/app9FKZ1Mu9gM63Qw/tbltfgIYuDxBTacqU/
const AIRTABLE_BASE_ID = "break";
const AIRTABLE_TABLE_ID = "break";

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(AIRTABLE_BASE_ID);

type Attendee = {
  Name: string;
  "Calculated Type": "Attendee" | "Supporter" | "Volunteer";
  Created: string;
};

type AttendeesList = {
  supporters: string[];
  attendees: string[];
  volunteers: string[];
};

export async function getAttendees(): Promise<AttendeesList> {
  const records = await base(AIRTABLE_TABLE_ID)
    .select({
      fields: ["Name", "Calculated Type", "Created"],
      sort: [{ field: "Created", direction: "asc" }],
    })
    // .select({
    //   fields: ["Name", "Calculated Type", "Created"],
    // })
    .all();

  const attendeesList: AttendeesList = {
    supporters: [],
    attendees: [],
    volunteers: ["Austin Chen", "Rachel Weinberg", "Ada When"],
  };

  records.forEach((record) => {
    const name = record.get("Name") as string;
    const type = record.get("Calculated Type") as Attendee["Calculated Type"];

    switch (type) {
      case "Supporter":
        attendeesList.supporters.push(name);
        break;
      case "Attendee":
        attendeesList.attendees.push(name);
        break;
      case "Volunteer":
        // Ignore duplicates, since we're hardcoding Austin/Rachel/Ada first
        if (!attendeesList.volunteers.includes(name)) {
          attendeesList.volunteers.push(name);
        }
        break;
    }
  });

  return attendeesList;
}
