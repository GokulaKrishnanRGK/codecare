import {Box, Pagination, Typography} from "@mui/material";

type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  disabled?: boolean;
  caption?: string;
};

export default function ListPagination({
                                         page,
                                         totalPages,
                                         onChange,
                                         disabled = false,
                                         caption,
                                       }: Readonly<Props>) {
  const safeTotalPages = Math.max(1, totalPages);

  return (
      <>
        <Box sx={{mt: 3, display: "flex", justifyContent: "center"}}>
          <Pagination
              count={safeTotalPages}
              page={page}
              onChange={(_e, value) => onChange(value)}
              color="primary"
              showFirstButton
              showLastButton
              disabled={disabled}
          />
        </Box>

        {caption ? (
            <Box sx={{mt: 1, textAlign: "center"}}>
              <Typography variant="caption" color="text.secondary">
                {caption}
              </Typography>
            </Box>
        ) : null}
      </>
  );
}
