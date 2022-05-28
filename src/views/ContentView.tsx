import {
    Component,
    ReactNode
} from "react";

import {
    useParams
} from "react-router-dom";

import {
    Grid
} from "@mui/material";

// @ts-ignore
import RenderViewMode from './RenderViewMode.tsx'
// @ts-ignore
import RenderCreateMode from './RenderCreateMode.tsx'

import { ToastContainer } from 'react-toastify'

function RenderView() {
    let params = useParams()
    return params.targetId !== undefined ? <RenderViewMode /> : <RenderCreateMode />
}

export default class ContentView extends Component {

    render(): ReactNode {
        return <>
            <Grid
                container
                justifyContent={`center`}
                columns={{ xs: 1, sm: 2, md: 12 }}
                sx={{ marginTop: `20px` }}>
                <Grid
                    item
                    xs={8}>
                    <RenderView />
                </Grid>
            </Grid>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </>
    }

}