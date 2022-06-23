import { Card, CardHeader, CardContent, Typography } from "@mui/material";
import React from "react";

const PlaceInfo = (props: any) => {
  const { name, vicinity, transitTimes } = props;
  return (
    <Card>
      <CardHeader title={name} subheader={vicinity} />
      <CardContent>
        <Typography variant="body1">
          {transitTimes[0].times.duration.text} from you,{" "}
          {transitTimes[1].times.duration.text} from them.
        </Typography>
        {/* add dollar signs, stars, one liner, photo */}
        {/* add share function to just send it off */}
      </CardContent>
    </Card>
  );
};

export { PlaceInfo };
