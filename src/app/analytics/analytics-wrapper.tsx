"use client";

import { useConsent } from "../providers/consent-provider";
import { GoogleAnalytics } from "./google-analytics";


export function AnalyticsWrapper(){

 const { consent } = useConsent();


 if(consent !== "accepted"){
    return null;
 }


 return <GoogleAnalytics/>;

}