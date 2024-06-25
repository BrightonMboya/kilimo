import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { GeistSans } from "geist/font/sans";

// Font.register({
//   family: "GeistSans",
//   fonts: [{ src: GeistSans.className }],
// });
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
    // fontFamily: "GeistSans",
  },
  section: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subheading: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 14,
    marginBottom: 5,
    display: "flex",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
  events: {
    backgroundColor: "#f8fafc",
    padding: "24px",
    borderWidth: "1px",
    borderRadius: "4px",
    borderColor: "#94a3b8",
  },
});

const PDFReport = ({ data }) => (
  <PDFViewer width="100%" height="800px">
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>{data.name}</Text>
          <Text style={styles.paragraph}>
            Organization Name: {data.Organization.name}
          </Text>
          <Text style={styles.paragraph}>Report ID: {data.id}</Text>
          <Text style={styles.paragraph}>
            Date Created: {format(data.dateCreated, "MMMM d, yyyy")}
          </Text>
          <Text style={styles.paragraph}>
            Finished Tracking: {data.finishedTracking ? "Yes" : "No"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Basic Details</Text>
          <View style={styles.section}>
            <Text style={styles.paragraph}>
              Farmer Name: {data.Harvests.Farmers.fullName}
            </Text>
            <Text style={styles.paragraph}>
              Country: {data.Harvests.Farmers.country}
            </Text>
            <Text style={styles.paragraph}>
              Province: {data.Harvests.Farmers.province}
            </Text>
            <Text style={styles.paragraph}>
              Inputs Used: {data.Harvests.inputsUsed}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Supply Chain Events</Text>
          {data.ReportTrackingEvents.map((event: any) => (
            <View
              key={event.id}
              style={[styles.section, styles.paragraph, styles.events]}
            >
              <View style={styles.container}>
                <Text style={styles.subheading}>Name:</Text>
                <Text style={styles.paragraph}>{event.eventName}</Text>
              </View>

              <View style={styles.container}>
                <Text style={styles.subheading}>Date Created:</Text>
                <Text style={styles.paragraph}>
                  {format(event.dateCreated, "MMMM d, yyyy")}
                </Text>
              </View>

              <View style={styles.container}>
                <Text style={styles.subheading}>Description:</Text>
                <Text style={styles.paragraph}>{event.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  </PDFViewer>
);

export default PDFReport;
