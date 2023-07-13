import { useState } from "react"
import { useNavigate } from "react-router-dom"

export const TicketForm = () => {
    /*
        TODO: Add the correct default properties to the
        initial state object
    */
    const [ticket, update] = useState({
        description: "", // this is a property for each form field that defaults to an empty string
        emergency: false // this default will be no emergency, //? meaning the checkbox defaults to not checked?
        // as the user is interacting with the input field and/or the emergency checkbox...each click will update these properties above
    })
    /*
        TODO: Use the useNavigation() hook so you can redirect the user to the ticket list
    */
    const navigate = useNavigate()

    const localHoneyUser = localStorage.getItem("honey_user")
    const honeyUserObject = JSON.parse(localHoneyUser)

    const handleSaveButtonClick = (event) => {
        event.preventDefault()

        // TODO: Create the object to be saved to the API

        const ticketToSendToAPI = { //? We used to have an object in our local database that was empty...the user filled it up...so is this the way to catch their input in react?
            userId: honeyUserObject.id,
            description: ticket.description,
            emergency: ticket.emergency,
            dateCompleted: ""
        }

        // TODO: Perform the fetch() to POST the object to the API/json server
        return fetch(`http://localhost:8088/serviceTickets`, { //GET is the default method for a fetch, but we want to POST to permanent State/database...so we specify these options below:
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ticketToSendToAPI) // this takes the object from ticketToSendToAPI and makes it into a string so it can be stored as .json in the server
        })
            .then(response => response.json()) // ...Steve didn't explain this part in the video and this is where I don't understand why we need it here...//?doesn't this convert a simple text from json server to an object for us in Javascript?
            .then(() => {
                navigate("/tickets") //...this will navigate the user back to the ticket list
            })

    }

    return (
        <form className="ticketForm">
            <h2 className="ticketForm__title">New Service Ticket</h2>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <input //the code from line 33 to 50 (wrapped in fieldset element) is all to create a description text with an input field below it
                        required autoFocus
                        type="text"
                        className="form-control"
                        placeholder="Brief description of problem" // this is the grayed out text that defaults in the description entry box
                        value={ticket.description} //?is this an example of declarative coding? Since we are ONLY coding what we want here and it's pulling from the tickets array in transient or permanent state?
                        onChange={
                            (evt) => {
                                const copy = { ...ticket } //create a copy of the existing state (object) using spread operator...
                                copy.description = evt.target.value // now modify the copy (ie - updae the state) with the new value of the input from the user (which is given to us by the changeEvent)...so the event targets the value of the input field and makes it the new version of the description field...
                                update(copy) // now make the new version of that copy the new State //? I don't grasp yet where data being entered by the user is being stored...what exactly is being copied...then updated....and where...on a web server? local machine? 
                            }
                        } />
                </div>
            </fieldset>

            <fieldset>
                <div className="form-group">
                    <label htmlFor="name">Emergency:</label>
                    <input type="checkbox" //* This code from fieldset element to fieldset element is just the little Emergency checkbox
                        value={ticket.emergency}
                        onChange={
                            (evt) => {
                                const copy = { ...ticket } //create a copy of the existing state using spread operator...
                                copy.emergency = evt.target.checked// check boxes don't use a .value...it needs a .checked to return true of false (ie - whether it is checked or not)
                                update(copy) // now use an update function to make the new version of that copy the new State
                            }
                        } />
                </div>
            </fieldset>
            <button
                onClick={(clickEvent) => handleSaveButtonClick(clickEvent)}
                className="btn btn-primary">
                Submit Ticket
            </button>
        </form>
    )
}