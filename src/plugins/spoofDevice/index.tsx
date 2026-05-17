/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { definePluginSettings } from "@api/Settings";
import { Card } from "@components/Card";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { Forms, UserStore } from "@webpack/common";

const settings = definePluginSettings({
    platform: {
        type: OptionType.SELECT,
        description: "What platform to show up as",
        restartNeeded: true,
        default: "desktop",
        options: [
            { label: "Desktop", value: "desktop" },
            { label: "Web", value: "web" },
            { label: "Android", value: "android" },
            { label: "iOS", value: "ios" },
            { label: "Xbox", value: "xbox" },
            { label: "PlayStation", value: "playstation" },
            { label: "VR", value: "vr" },
        ]
    }
});

export default definePlugin({
    name: "SpoofDevice",
    description: "Spoof your reported platform/device",
    tags: ["Utility"],
    authors: [Devs.SkyDash, Devs.Nro],
    settings,

    settingsAboutComponent: () => (
        <Card variant="warning">
            <Forms.FormTitle tag="h3">Warning</Forms.FormTitle>
            <Forms.FormText>
                Use at your own risk! It is unknown if this can get you banned.
            </Forms.FormText>
        </Card>
    ),

    patches: [
        {
            find: "_doIdentify(){",
            replacement: [
                {
                    match: /window._ws=null,null!=\i/,
                    replace: "false"
                },
                {
                    match: /(?<="GatewaySocket"\)\}\),properties:)(\i)/,
                    replace: "{...$1,...$self.getPlatform(true)}"
                },
            ]
        }
    ],

    getPlatform(bypass: boolean, userId?: string) {
        const platform = settings.store.platform ?? "desktop";

        if (bypass || userId === UserStore.getCurrentUser()?.id) {
            switch (platform) {
                case "desktop":
                    return { browser: "Discord Client" };
                case "web":
                    return { browser: "Discord Web" };
                case "ios":
                    return { browser: "Discord iOS", os: "iOS" };
                case "android":
                    return { browser: "Discord Android", os: "Android" };
                case "xbox":
                    return { browser: "Discord Embedded", os: "Xbox" };
                case "playstation":
                    return { browser: "Discord Embedded", os: "PlayStation" };
                case "vr":
                    return { browser: "Discord VR", os: "VR" };
                default:
                    return null;
            }
        }

        return null;
    }
});
