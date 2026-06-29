import axios from "axios";
import { useEffect, useState } from "react"

type Cvss = {
    id: string;
    title: string;
}
export default function Cvss_Data(){
    const [cvss, setCvss] = useState<Cvss[]>([]);

    useEffect(() => {
 const fetchData = async() => {
    try {
 const res = await axios.get("");
            setCvss(res.data);

        } catch(error) {
            console.error("Error Fetch Data", error);
        }
    }
   fetchData();       
     
}, []);

        return (
        <>
        {cvss.map((item) => (
            <>
            <div key={item.id}>
                <h1></h1>


            </div>
            </>
        ))}
        </>
    )
}