import { Button, ButtonProps } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type MyButtonProps = {
  label: string;
} &ButtonProps;


const MyButton: React.FC<MyButtonProps> = ({ label, ...props }) => {
  return (
    <Button
      {...props}
    >
      {label}
    </Button>
  );
};

export default MyButton;
