import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Card, CardHeader} from '@mui/material';
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ReportIcon from '@mui/icons-material/Report';

const ForbiddenComponent: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
      <Card>
        <CardHeader
            avatar={<ReportIcon/>}
            title="Access Forbidden"
        />
        <CardContent>
          <Typography variant="body1">
            Sorry, you do not have permission to access this page.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleBack}>
            Go Back
          </Button>
        </CardContent>
      </Card>
  );
};

export default ForbiddenComponent;
