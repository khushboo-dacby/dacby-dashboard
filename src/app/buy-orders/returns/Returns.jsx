"use client";

import React from "react";
import BuyOrdersView from "../components/BuyOrdersView";

/**
 * Returns Buy Orders Pipeline Component.
 * Shares common table, mobile cards, and filtering logic with Forward Buy Orders.
 * Any returns-specific customizations can be passed as props to BuyOrdersView or customized here.
 */
export default function Returns(props) {
    return <BuyOrdersView key="returns" type="returns" {...props} />;
}
