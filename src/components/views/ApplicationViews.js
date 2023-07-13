// Which component watches the browser URL and displays the correct component? THIS ONE... the ApplicationViews module
//* From Bard: "So, to summarize, the code you provided watches the browser URL and displays the correct component based on the path of the URL."
//So instead of building a different webpage for every state of data, we render "components" (pieces of a website) to the DOM which displays UPDATED components/info on the SAME page. So even though the url now has a path that includes /new at the end, we are viewing the same html page.

// When I click on the "new decoration" button, we are at a new web address/url…but it's the same html document as before, just rendered with updated info. So how do we get to the /new part of the url?

// We are "routed" by the ApplicationViews module which runs functions that update the data we are seeing…whether it's buttons on a web page or data that a user entered, etc.

import { Outlet, Route, Routes } from "react-router-dom"
import { TicketList } from "../tickets/TicketList"
import { TicketForm } from "../tickets/TicketForm.js"

export const ApplicationViews = () => {
	return ( //* this function returns 3 route objects: Outlet, TicketList and TicketForm
        <Routes> 
            <Route path="/" element={ //the file path begins with the home page //? as indicated by the forward slash i think? 
            // the file paths of each of the three components are: /, tickets, and tickets/create ... and each one of those has an object as its element. SO essentially, when the path is file path is followed, you end up in that html (jsx) and the browser displays whatever we coded below in fragments. THe last two components display the list of tickets and a ticketform. Notice no functionality is coded here...it's all in the TicketForm module and TicketList module.
                <>
                    <h1>Honey Rae Repair Shop</h1>
                    <div>Your one-stop-shop to get all your electronics fixed</div>

                    <Outlet /> 
                </>
            }>

                <Route path="tickets" element={ <TicketList /> } />
                <Route path="ticket/create" element={ <TicketForm /> } />
            </Route>
        </Routes>
    )
}

//* Look at line 22 for the TicketForm function we imported and inserted....what does that line 22 mean?
//*From Bard: "This means that when the browser URL is localhost:3000/ticket/create, the TicketForm component will be rendered."