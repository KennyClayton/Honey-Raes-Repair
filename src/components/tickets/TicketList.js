import { useEffect, useState } from "react"
import "./Tickets.css"
import { useNavigate } from "react-router-dom"

export const TicketList = () => {
    const [tickets, setTickets] = useState([]) //* More on this below, but this is a "React Hook". This is known as array destructuring. Not sure wtm atm.
    const [filteredTickets, setFiltered] = useState([]) // we don't want to MODIFY the array of tickets we got from the API/permanent state...so we define this new useState([])
    const [emergency, setEmergency] = useState(false) //this is another State variable that will track whether or not an emergencyticket should be listed for the user/employee...and we set the default to false, meaning that ALL tickets will be shown, not just the emergency ones
    const [openOnly, updateOpenOnly] = useState(false) //* this is a react hook. It takes from the react library of tools and does something. Basically it acts like a function. It creates a "state variable" called openOnly. Variables hold data. What data? In this case, it will hold only the tickets that are still open. But this is a "state" variable....meaning the value of this variable changes. It may be 3 tickets right now...but once a ticket is completed, the balue of openOnly will change to 2. If one is added later, it goes back to three...etc. 
    //? what about the false? That is the initial value of the state variable. openOnly is a data type of boolean, meaning the data (ticket) is either open or completed. So the initial value of any ticket in the openOnly array of tickets is "false".
    //* updateOpenOnly is a callback function that is used to update the "openOnly" value. When? When a ticket is completed or a new ticket is added. So how do we know when a ticket is added or removed(completed)? We have to watch the state of the tickets array. How? With useEffect i think.
    const navigate = useNavigate()

    const localHoneyUser = localStorage.getItem("honey_user") //...get the honey_user object out of local storage
    const honeyUserObject = JSON.parse(localHoneyUser) //...convert the string above into an object so we can use it in our code...this variable will be an object with two keys of "id" and "staff"

    useEffect( // observe state and if there is an emergency:true then 
        () => {
            if (emergency) { // so if the 
                const emergencyTickets = tickets.filter(ticket => ticket.emergency === true)
                setFiltered(emergencyTickets)
            }
            else {
                setFiltered(tickets) // this will allow the user to go back to showing all the tickets when they click the Show All button ... so if you clicked the Emergency Only button, it will only show the Emergency tickets....the Show All button will show all of the tickets.
            }
        },
        [emergency]
    )


    useEffect(
        () => {
            fetch(`http://localhost:8088/serviceTickets`) // this fetch retrieves all of the tickets from permanent state...
                .then(response => response.json()) // once we get the response, we have it converted back into an array for Javascript (ie - we parse the json into a JS array)
                .then((ticketArray) => { //...then, using the ticketArray (which is our entire list of tickets just retrived from the JSON server), we will run the setTickets function...
                    setTickets(ticketArray)
                })
        },
        [] // When this array is empty, you are observing initial component state
    )
    //! THE WHOLE PURPOSE OF useEffect() IS TO OBSERVE THE STATE OF DATA 
    //* THE WHOLE PURPOSE OF useEffect() IS TO OBSERVE THE STATE OF DATA
    useEffect( //...if the user is a customer when logging in, we want to filter all the tickets down to JUST that customer's tickets
        //...how do we do that? we have to observe the state of the tickets (our array of tickets in permanent state?)...
        () => {
            if (honeyUserObject.staff) { //if the user logging in is a staff member, they will have a staff boolean of true...so if it's true... 
                // For employees
                setFiltered(tickets) //then set the filter to show ALL tickets...because employees can see all tickets while customers are limited to just their own tickets
            }
            else { //...but if the user logging in is a customer, filter the tickets 
                // For customers
                const myTickets = tickets.filter(ticket => ticket.userId === honeyUserObject.id) // all tickets filtered down to where the ticket userId equals honey_user object Id... in other words, the logged-in user's Id (their primary key) is matched to any tickets with that same userId (foreign key)
                setFiltered(myTickets) //then set the filter to show ONLY the logged-in customer's ticket(s)
            }
        },
        [tickets] //...this is an observing array. We are watching the tickets array for any kind of change
    )
    //...now watch for the state of data to change. What data? Defined below, we ask for it to watch the openOnly value to change from an open ticket to a completed ticket. //? or are we watching the openTicketArray?
    //^ ASK INSTRUCTORS IF THE BELOW NOTES I TOOK MAKES SENSE
    useEffect(() => { // We are going to watch the state of some data with the useEffect hook...
        if (openOnly) {
        const openTicketArray = tickets.filter(ticket => { //...we'll catch the return of the function below in openTicketArray. We'll use a filter method on the tickets array... and for each ticket...
            return ticket.userId === honeyUserObject.id && ticket.dateCompleted === "" //...we want to compare each ticket's userId and return all ticket objects that are equal to two conditions: if the ticket's userId is the same as the honey user's id, AND that ticket's dateCompleted is equal to an empty string (ir it is not completed yet)...then return those ticket objects to the openTicketArray variable.....and then...
        })
        setFiltered(openTicketArray) //...run the setFiltered function on those matching ticket objects which will set them as the new State //? in permanent state?
        }
        else {
            const myTickets = tickets.filter(ticket => ticket.userId === honeyUserObject.id)
            setFiltered(myTickets)
        }
    }    ,
        [openOnly] //? is this what we are watching with our useEffect hook?

    ) //* for future reference, the !== code means must not equal. And after that is added empty quotes like this "", which means an empty string. So that would have meant if 


    return <>
        {
            honeyUserObject.staff // ternary statement....if the user is on staff....if that is TRUE...then show this button...
                // remember that you have to use fragments to encase your buttons bc react will only allow one ... something
                ? <>
                    <button onClick={() => { setEmergency(true) }}>Emergency Only</button>
                    <button onClick={() => { setEmergency(false) }}>Show All</button>
                </>
                // : "" //...but if it's false, the colon means "if that's false, then...", followed by empty string quotes "" which means place an empty string (ie - do not show the button)
                // below buttons:
                // on click of user's mouse on the Create Ticket button, navigate to the creat web page //? (or, technically, the create component?
                // on click of user's mouse on the Show Open Tickets button, update the list of tickets to ONLY show tickets that are still open ( ie - uncompleted tickets))
                : <>
                    <button onClick={() => navigate("/ticket/create")}>Create Ticket</button>
                    <button onClick={() => updateOpenOnly(true)}>Show Open Tickets</button>
                    <button onClick={() => updateOpenOnly(false)}>All My Tickets</button>
                </>
        }

        <h2>List of Tickets</h2>

        <article className="tickets">
            {
                filteredTickets.map(
                    (ticket) => {
                        return <section className="ticket">
                            <header>{ticket.description}</header>
                            <footer>Emergency: {ticket.emergency ? "🧨" : "No"}</footer>
                        </section>
                    }
                )
            }
        </article>
    </>
}