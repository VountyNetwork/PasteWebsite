import {
    Stack,
    Grid,
    Button
} from "@mui/material";

import {
    useTheme
} from '@mui/material/styles';

import useMediaQuery from '@mui/material/useMediaQuery';

export default function NavigationComponent(props: any) {

    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.up('md'))
    const matchesIcon = useMediaQuery(theme.breakpoints.up('lg'))

    return !matches ?
        <Stack
            direction={`row`}
            id={`navigation`}>
            <Grid
                container
                justifyContent={`center`}
                alignItems={`center`}>
                <img
                    draggable={`false`}
                    src={`https://cdn.vounty.net/Logo.png`}
                    alt={`Logo`}
                    height={75} /> <></>
                <h4 className={`navigationTitle`}>{`Paste`}</h4>
            </Grid>
        </Stack> :
        <Stack
            direction={`row`}
            id={`navigation`}>
            <Grid
                container
                justifyContent={`flex-start`}
                alignItems={`center`}>
                <img
                    draggable={`false`}
                    src={`https://cdn.vounty.net/Logo.png`}
                    alt={`Logo`}
                    height={75} />
                {(matchesIcon ? <h4 className={`navigationTitle`}>{`Paste`}</h4> : <></>)}
            </Grid>
            <Grid
                container
                justifyContent={`flex-end`}
                alignItems={`center`}>
                <Stack
                    direction={`row`}
                    spacing={2}
                    className={`navigationLink`}>
                    <Button
                        onClick={ props.newFunction }
                        variant={`text`}
                        sx={{
                            backgroundColor: ``,
                            '&:hover': { backgroundColor: `` }
                        }}>
                        <span className={`navigationLink`}><i className="fa-solid fa-plus"></i> New</span>
                    </Button>
                </Stack>
            </Grid>
        </Stack>

}