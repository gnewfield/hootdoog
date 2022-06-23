import { Card, CardHeader, CardContent, Typography } from "@mui/material";
import React from "react";

const PlaceInfo = (props: any) => {
  const { name, formatted_address } = props;
  return (
    <Card>
      <CardHeader title={name} subheader={formatted_address} />
      <CardContent></CardContent>
    </Card>
  );
};

export { PlaceInfo };
