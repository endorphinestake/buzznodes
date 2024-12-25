import { memo, useState, ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
} from '@mui/material';
import { ChevronDown, ChevronUp } from 'mdi-material-ui';

interface IProps {
  title?: string;
  children: ReactNode;
}

const CollapsedCard = (props: IProps) => {
  const { title, children } = props;

  // ** State
  const [collapsed, setCollapsed] = useState<boolean>(true);

  return (
    <Card sx={{ position: 'relative' }}>
      <CardHeader
        title={title}
        sx={{
          pb: 4,
          '& .MuiCardHeader-title': { letterSpacing: '.15px' },
        }}
        action={
          <IconButton
            size='small'
            aria-label='collapse'
            sx={{ color: 'text.secondary' }}
            onClick={() => setCollapsed(!collapsed)}
          >
            {!collapsed ? (
              <ChevronDown fontSize='small' />
            ) : (
              <ChevronUp fontSize='small' />
            )}
          </IconButton>
        }
      />
      <Collapse in={collapsed}>
        <CardContent>{children}</CardContent>
      </Collapse>
    </Card>
  );
};

export default memo(CollapsedCard);
