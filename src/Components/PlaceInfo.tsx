import { Card, CardHeader, CardContent, Typography } from "@mui/material";
import React from "react";

const PlaceInfo = (props: any) => {
  const { place } = props;
  return (
    <Card>
      {/* <CardHeader title={place.name} subheader={place.formatted_address} />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {place.formatted_phone_number}
        </Typography>
      </CardContent> */}
    </Card>
  );
};

export { PlaceInfo };
