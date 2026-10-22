"use client";

import React from "react";
import BuyOrdersView from "../components/BuyOrdersView";

/**
 * Forward Buy Orders Pipeline Component.
 * Shares common table, mobile cards, and filtering logic with Returns Buy Orders.
 * Any forward-specific customizations can be passed as props to BuyOrdersView or customized here.
 */
export default function Forward(props) {
    return <BuyOrdersView key="forward" type="forward" {...props} />;
}
