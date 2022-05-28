import {
    Component,
    ReactNode,
    useState
} from "react";

// @ts-ignore
import NavigationComponent from "../components/NavigationComponent.tsx";

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
    TextField
} from "@mui/material";

import axios from "axios";

import {
    toast
} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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

const defaultDocumentTitle = `/*\n          paste.vounty.net\n    cσᴅᴇ/scʀıρт sнᴀʀıɴɢ мᴀᴅᴇ ᴇᴀsʏ\n ╦  ╦┌─┐┬ ┬┌┐┌┌┬┐┬ ┬ ╔═╗┌─┐┌─┐┌┬┐┌─┐\n ╚╗╔╝│ ││ ││││ │ └┬┘ ╠═╝├─┤└─┐ │ ├┤\n  ╚╝ └─┘└─┘┘└┘ ┴  ┴  ╩  ┴ ┴└─┘ ┴ └─┘\n      Powered by VountyNetwork\n*/`
const fallbackURL = "https://api.vounty.net"

function handleNewPaste(document: String, language: String, publisher: String, password: String, then: any) {

    if (document === defaultDocumentTitle || document.replace(defaultDocumentTitle, "").length === 0) {
        createToast('Fill the paste with something else.', 3000, 'warn')
        then(undefined)
        return
    }

    if (document.replace(defaultDocumentTitle, "").length > 25000) {
        createToast('A paste can contain only 25.000 characters.', 3000, 'warn')
        then(undefined)
        return
    }

    fetchInformation(fallbackURL + "/paste/create", "POST", {
        document: document,
        language: language,
        publisher: publisher,
        password: password
    }, (data: any) => {
        const isCancelled = data.cancelled

        if (isCancelled) {
            createToast(data.content, 3000, 'error')
            return
        }

        createToast('Your paste was created.', 3000, 'info')

        then(data.content)
    }, (error: any) => {
        createToast('An error has occurred. Please look at the console.', 3000, 'error')
        console.error(error)
    })

    then(undefined)
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

function RenderView() {

    const [mode, setMode] = useState('vs-dark')
    const [codeLanguage, setCodeLanguage] = useState('Java')

    const [publisher, setPublisher] = useState('Anonymous')
    const [password, setPassword] = useState('')
    const [document, setDocument] = useState(defaultDocumentTitle)

    function toggleMode() {
        setMode(mode === 'vs-dark' ? 'light' : 'vs-dark')
    }

    const [warning, setWarning] = useState(false)
    const [information, setInformation] = useState(false)
    const [informationContent, setInformationContent] = useState(null)

    return <>

        <Dialog
            open={information}
            onClose={() => setInformation(false)}
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description">
            <DialogTitle id="dialog-title">{"Information"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="dialog-description">
                    <span>Your paste was created successfully.</span>
                    <br /><br />
                    <span>ID: <a href={informationContent !== null ? informationContent.url : ''} target={`_blank`}>{informationContent !== null ? informationContent.url.replace("https://paste.vounty.net/", "") : ''}</a></span>
                    <br />
                    <span>Delete Token: <span className={`selectable`}>{informationContent !== null ? informationContent.deleteToken : ''}</span></span>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setInformation(false)} color={`error`}>Close</Button>
            </DialogActions>
        </Dialog>

        <Dialog
            open={warning}
            onClose={() => setWarning(false)}
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description">
            <DialogTitle id="dialog-title">{"Do you really want to create a new paste?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="dialog-description">
                    {"Clicking the action 'Create new Paste' will delete your current paste."}
                    <br />
                    {"Click 'Cancel' to cancel the action."}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setWarning(false)} color={`error`}>Cancel</Button>
                <Button onClick={() => { setWarning(false); window.location.href = './' }} variant={`contained`}>Create new Paste</Button>
            </DialogActions>
        </Dialog>

        <NavigationComponent newFunction={() => setWarning(true)} />

        <Editor
            loading={`Loading content...`}
            height={`70vh`}
            theme={mode}
            onChange={value => setDocument(value)}
            language={codeLanguage.toLowerCase()}
            value={document}
        />

        <Grid
            container
            justifyContent={`center`}
            columns={{ xs: 1, sm: 2, md: 12 }}
            sx={{ marginTop: `20px` }}>
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
                    columns={{ xs: 1, sm: 2, md: 12 }}
                    alignItems={`center`}>

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
                            onChange={event => setPublisher(event.target.value)}
                            value={publisher} />

                        <TextField
                            label={`Password`}
                            variant={`outlined`}
                            type={`password`}
                            fullWidth
                            onChange={event => setPassword(event.target.value)}
                            value={password} />

                        <Button
                            fullWidth
                            className={`createButton`}
                            variant={`contained`}
                            onClick={() => {
                                handleNewPaste(document, codeLanguage, publisher, password, (result: any) => {

                                    if (result !== undefined) {
                                        setInformation(true)
                                        setInformationContent(result)

                                        setDocument(defaultDocumentTitle)
                                        setPassword("")
                                        setPublisher("Anonymus")
                                    }

                                })
                            }}>Create</Button>

                    </Stack>

                </Grid>

            </Grid>
        </Grid>

    </>
}

export default class RenderCreateMode extends Component {

    render(): ReactNode {
        return <RenderView />
    }

}