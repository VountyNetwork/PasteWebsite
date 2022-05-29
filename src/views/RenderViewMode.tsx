import {
    Component,
    ReactNode,
    useState
} from "react";

import {
    useParams
} from "react-router-dom";

import Editor from "@monaco-editor/react";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Switch,
    TextField,
    useMediaQuery,
    useTheme
} from "@mui/material";

import axios from "axios";

import {
    toast
} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// @ts-ignore
import NavigationComponent from "../components/NavigationComponent.tsx";

const languages = [
    "Markdown",
    "TypeScript",
    "JavaScript",
    "CSS",
    "LESS",
    "SCSS",
    "SASS",
    "JSON",
    "HTML",
    "XML",
    "PHP",
    "C#",
    "C++",
    "Razor",
    "Java",
    "VB",
    "CoffeeScript",
    "Batch",
    "F#",
    "Lua",
    "Powershell",
    "Python",
    "Ruby",
    "R",
    "Objective-C"
]

function getLanguageById(id: any) {
    return languages[id]
}

function getLanguageByName(name: String) {
    for (let index = 0; index < languages.length; index++) {
        const language = languages[index]
        if (language.toLowerCase() === name.toLowerCase()) {
            return index
        }
    }
    return 0
}

function createToast(text: String, timeout: any, type: String) {
    switch (type.toLowerCase()) {
        case "error":
            toast.error(text, {
                position: "top-right",
                autoClose: timeout,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            break;
        case "info":
            toast.info(text, {
                position: "top-right",
                autoClose: timeout,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            break;
        case "warn":
            toast.warn(text, {
                position: "top-right",
                autoClose: timeout,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            break;
        case "default":
        default:
            toast(text, {
                position: "top-right",
                autoClose: timeout,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            break;
    }
}

function fetchInformation(url: any, method: String, data: any, then: any, failed: any) {
    switch (method.toUpperCase()) {
        case "POST":
            axios.post(url, data).then(result => then(result.data)).catch(error => { failed(error); console.log(error); });
            break;
        case "GET":
            axios.get(url, data).then(result => then(result.data)).catch(error => { failed(error); console.log(error); });
            break;
    }
}

function handleAboutPaste(documentId: String, then: any) {
    fetchInformation(fallbackURL + "/paste/about", "POST", {
        document: documentId
    }, (data: any) => {
        then(data)
    }, (error: any) => {
        createToast('An error has occurred. Please look at the console.', 3000, 'error')
        console.error(error)
    })

    then(undefined)
}

function checkPassword(documentId: String, password: String, then: any) {
    fetchInformation(fallbackURL + "/paste/checkPassword", "POST", {
        document: documentId,
        password: password
    }, (data: any) => {
        then(data)
    }, (error: any) => {
        createToast('An error has occurred. Please look at the console.', 3000, 'error')
        console.error(error)
    })

    then(undefined)
}

function deletePaste(documentId: String, token: String, then: any) {
    fetchInformation(fallbackURL + "/paste/delete", "POST", {
        document: documentId,
        deleteToken: token
    }, (data: any) => {
        then(data)
    }, (error: any) => {
        createToast('An error has occurred. Please look at the console.', 3000, 'error')
        console.error(error)
    })

    then(undefined)
}

const fallbackURL = "https://api.vounty.net"

function RenderView() {
    const params = useParams()

    const [isInitialized, setInitialized] = useState(false)

    const [mode, setMode] = useState('vs-dark')
    const [codeLanguage, setCodeLanguage] = useState('')

    const [publisher, setPublisher] = useState('')
    const [document, setDocument] = useState('')

    const [hasPassword, setHasPassword] = useState(false)
    const [password, setPassword] = useState('')

    const [deleting, setDeleting] = useState(false)
    const [deleteToken, setDeleteToken] = useState('')

    if (!isInitialized) {
        setInitialized(true)

        handleAboutPaste(params.targetId, (result: any) => {

            if (result === undefined) {
                return
            }

            const isCancelled = result.cancelled
            const message = result.content

            if (message.toString() === 'Cannot find Paste with this ID.') {
                createToast('Cannot find Paste with this ID.', 3000, 'error')
                setTimeout(() => window.location.href = './', 4000)
                return
            }

            if (message.toString().startsWith("You are sending too much data to our system.")) {
                createToast(message, 3000, 'warn')
                return
            }

            if (isCancelled && message === 'The Paste requires a password.') {
                setHasPassword(true)
            } else {
                setHasPassword(false)
                setPublisher(message.publisher)
                setCodeLanguage(message.language)
                setDocument(message.document)
            }
        })
    }

    function toggleMode() {
        setMode(mode === 'vs-dark' ? 'light' : 'vs-dark')
    }

    const theme = useTheme()
    const matches = useMediaQuery(theme.breakpoints.up('lg'))

    return <>

        <Dialog
            open={deleting}
            onClose={() => setDeleting(false)}
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description">
            <DialogTitle id="dialog-title">{"Delete this Paste"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="dialog-description">
                    <p>Enter the DeleteToken to delete this Paste.</p>
                    <TextField
                        label={`Token`}
                        variant={`outlined`}
                        fullWidth
                        onChange={event => setDeleteToken(event.target.value)}
                        value={deleteToken} />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    color={`error`}
                    variant={`contained`}
                    onClick={() => {
                        deletePaste(params.targetId, deleteToken, (result: any) => {

                            if (result === undefined) {
                                return
                            }

                            const isCancelled = result.cancelled
                            const message = result.content

                            if (isCancelled) {
                                createToast(message, 3000, "error")
                                return
                            }

                            setDeleting(false)
                            createToast(message, 3000, "info")
                            setTimeout(() => window.location.href = './', 4000)
                        })
                    }}>Delete Paste</Button>
            </DialogActions>
        </Dialog>

        <Dialog
            open={hasPassword}
            onClose={() => {
                setTimeout(() => {
                    setHasPassword(true)
                }, 50)
            }}
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description">
            <DialogTitle id="dialog-title">{"Password"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="dialog-description">
                    <p>Enter the password to be able to see this paste.</p>
                    <TextField
                        label={`Password`}
                        variant={`outlined`}
                        fullWidth
                        onChange={event => setPassword(event.target.value)}
                        value={password} />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    checkPassword(params.targetId, password, (result: any) => {

                        if (result === undefined) {
                            return
                        }

                        const isCancelled = result.cancelled
                        const message = result.content

                        if (message.toString() === 'Cannot find Paste with this ID.') {
                            createToast('Cannot find Paste with this ID.', 3000, 'error')
                            setTimeout(() => window.location.href = './', 4000)
                            return
                        }

                        if (!isCancelled) {
                            setHasPassword(false)
                            setPublisher(message.publisher)
                            setCodeLanguage(message.language)
                            setDocument(message.document)
                        } else createToast(message, 3000, 'error')
                    })
                }} variant={`contained`}>View Paste</Button>
            </DialogActions>
        </Dialog>

        <NavigationComponent newFunction={() => window.location.href = '../'} />

        <Editor
            loading={`Loading content...`}
            height={`70vh`}
            theme={mode}
            language={codeLanguage.toLowerCase()}
            value={document}
        />

        <Grid
            container
            justifyContent={`center`}
            alignItems={`center`}
            columns={{ xs: 1, sm: 4, md: 12 }}
            sx={{ marginTop: `20px`, marginBottom: `20px` }}>
            <Grid
                className={`bottomContainer`}
                item
                xs={12}
                sx={{ textAlign: 'center' }}>

                <Grid
                    container
                    className={`bottomSegment`}
                    direction={`row`}
                    justifyContent={`center`}
                    alignItems={`center`}
                    columnSpacing={2}
                    rowSpacing={matches ? 0 : 3}>

                    {
                        matches ?
                            <>
                                <Stack
                                    direction={`row`}
                                    spacing={2}
                                    sx={{ width: '75%' }}>

                                    <FormControlLabel
                                        control={<Switch color="primary" checked={mode === 'vs-dark'} />}
                                        label={`Darkmode`}
                                        onClick={() => toggleMode()}
                                        labelPlacement={`end`}
                                        sx={{ color: '#171717' }}
                                    />

                                    <FormControl fullWidth>
                                        <InputLabel id="language-label">Language</InputLabel>
                                        <Select
                                            disabled
                                            labelId="language-label"
                                            onChange={event => setCodeLanguage(getLanguageById(event.target.value))}
                                            value={getLanguageByName(codeLanguage)}
                                            label="Language">
                                            {
                                                languages.map((language, index) => {
                                                    return <MenuItem key={index} value={index}>{language}</MenuItem>
                                                })
                                            }
                                        </Select>
                                    </FormControl>

                                    <Divider orientation="vertical" flexItem />

                                    <TextField
                                        label={`Name*`}
                                        variant={`outlined`}
                                        fullWidth
                                        disabled
                                        onChange={event => setPublisher(event.target.value)}
                                        value={publisher} />

                                    <Button
                                        fullWidth
                                        className={`deleteButton`}
                                        variant={`contained`}
                                        color={`error`}
                                        onClick={() => setDeleting(true)}>Delete</Button>

                                </Stack>
                            </>
                            :
                            <>
                                <Grid
                                    item
                                    xs={10}>

                                    <FormControlLabel
                                        control={<Switch color="primary" checked={mode === 'vs-dark'} />}
                                        label={`Darkmode`}
                                        onClick={() => toggleMode()}
                                        labelPlacement={`end`}
                                        sx={{ color: '#171717' }}
                                    />

                                </Grid>
                                <Grid
                                    item
                                    xs={10}>

                                    <FormControl fullWidth>
                                        <InputLabel id="language-label">Language</InputLabel>
                                        <Select
                                            disabled
                                            labelId="language-label"
                                            onChange={event => setCodeLanguage(getLanguageById(event.target.value))}
                                            value={getLanguageByName(codeLanguage)}
                                            label="Language">
                                            {
                                                languages.map((language, index) => {
                                                    return <MenuItem key={index} value={index}>{language}</MenuItem>
                                                })
                                            }
                                        </Select>
                                    </FormControl>

                                </Grid>
                                <Grid
                                    item
                                    xs={10}>

                                    <TextField
                                        label={`Name*`}
                                        variant={`outlined`}
                                        fullWidth
                                        disabled
                                        onChange={event => setPublisher(event.target.value)}
                                        value={publisher} />

                                </Grid>
                                <Grid
                                    item
                                    xs={10}>

                                    <Button
                                        fullWidth
                                        className={`deleteButton`}
                                        variant={`contained`}
                                        color={`error`}
                                        onClick={() => setDeleting(true)}>Delete</Button>

                                </Grid>
                            </>
                    }

                </Grid>

            </Grid>
        </Grid>

    </>
}

export default class RenderViewMode extends Component {

    render(): ReactNode {
        return <RenderView />
    }

}