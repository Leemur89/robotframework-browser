// Copyright 2020-     Robot Framework Foundation
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Server, ServerUnaryCall, sendUnaryData } from 'grpc';

import * as browserControl from './browser-control';
import * as cookie from './cookie';
import * as deviceDescriptors from './device-descriptors';
import * as evaluation from './evaluation';
import * as getters from './getters';
import * as interaction from './interaction';
import * as network from './network';
import * as playwrightState from './playwright-state';
import { IPlaywrightServer } from './generated/playwright_grpc_pb';
import { PlaywrightState } from './playwright-state';
import { Request, Response } from './generated/playwright_pb';

export class PlaywrightServer implements IPlaywrightServer {
    state: PlaywrightState;

    constructor() {
        this.state = new PlaywrightState();
    }

    private getActiveBrowser = () => this.state.getActiveBrowser();
    private getActiveContext = () => this.state.getActiveContext();
    private getActivePage = () => this.state.getActivePage();

    async closeBrowser(call: ServerUnaryCall<Request.Empty>, callback: sendUnaryData<Response.String>): Promise<void> {
        try {
            const result = await playwrightState.closeBrowser(this.state);
            callback(null, result);
        } catch (e) {
            callback(e, null);
        }
    }
    async closeAllBrowsers(
        call: ServerUnaryCall<Request.Empty>,
        callback: sendUnaryData<Response.Empty>,
    ): Promise<void> {
        try {
            const result = await playwrightState.closeAllBrowsers(this.state);
            callback(null, result);
        } catch (e) {
            callback(e, null);
        }
    }

    async closeContext(call: ServerUnaryCall<Request.Empty>, callback: sendUnaryData<Response.Empty>): Promise<void> {
        try {
            const result = await playwrightState.closeContext(this.state);
            callback(null, result);
        } catch (e) {
            callback(e, null);
        }
    }

    async closePage(call: ServerUnaryCall<Request.Empty>, callback: sendUnaryData<Response.Empty>): Promise<void> {
        try {
            const result = await playwrightState.closePage(this.state);
            callback(null, result);
        } catch (e) {
            callback(e, null);
        }
    }

    async getBrowserCatalog(
        call: ServerUnaryCall<Request.Empty>,
        callback: sendUnaryData<Response.Json>,
    ): Promise<void> {
        try {
            const result = await playwrightState.getBrowserCatalog(this.state);
            callback(null, result);
        } catch (e) {
            callback(e, null);
        }
    }

    async getCookies(call: ServerUnaryCall<Request.Empty>, callback: sendUnaryData<Response.Json>): Promise<void> {
        return cookie.getCookies(callback, this.getActiveContext());
    }

    async addCookie(call: ServerUnaryCall<Request.Json>, callback: sendUnaryData<Response.Empty>): Promise<void> {
        return cookie.addCookie(call, callback, this.getActiveContext());
    }

    async deleteAllCookies(
        call: ServerUnaryCall<Request.Empty>,
        callback: sendUnaryData<Response.Empty>,
    ): Promise<void> {
        return cookie.deleteAllCookies(callback, this.getActiveContext());
    }

    async switchPage(
        call: ServerUnaryCall<Request.IdWithTimeout>,
        callback: sendUnaryData<Response.String>,
    ): Promise<void> {
        try {
            const response = await playwrightState.switchPage(call, this.state.getActiveBrowser());
            callback(null, response);
        } catch (e) {
            callback(e, null);
        }
    }

    async switchContext(call: ServerUnaryCall<Request.Index>, callback: sendUnaryData<Response.String>): Promise<void> {
        return playwrightState.switchContext(call, callback, this.state.getActiveBrowser());
    }

    async switchBrowser(call: ServerUnaryCall<Request.Index>, callback: sendUnaryData<Response.String>): Promise<void> {
        return playwrightState.switchBrowser(call, callback, this.state);
    }

    async newPage(call: ServerUnaryCall<Request.Url>, callback: sendUnaryData<Response.String>): Promise<void> {
        try {
            const response = await playwrightState.newPage(call, this.state);
            callback(null, response);
        } catch (e) {
            callback(e, null);
        }
    }

    async newContext(call: ServerUnaryCall<Request.Context>, callback: sendUnaryData<Response.String>): Promise<void> {
        return playwrightState.newContext(call, callback, this.state);
    }

    async newBrowser(call: ServerUnaryCall<Request.Browser>, callback: sendUnaryData<Response.String>): Promise<void> {
        return playwrightState.newBrowser(call, callback, this.state);
    }

    async goTo(call: ServerUnaryCall<Request.Url>, callback: sendUnaryData<Response.Empty>): Promise<void> {
        return browserControl.goTo(call, callback, this.getActivePage());
    }

    async goBack(call: ServerUnaryCall<Request.Empty>, callback: sendUnaryData<Response.Empty>): Promise<void> {
        return browserControl.goBack(callback, this.getActivePage());
    }

    async goForward(call: ServerUnaryCall<Request.Empty>, callback: sendUnaryData<Response.Empty>): Promise<void> {
        return browserControl.goForward(callback, this.getActivePage());
    }

    async takeScreenshot(
        call: ServerUnaryCall<Request.ScreenshotOptions>,
        callback: sendUnaryData<Response.String>,
    ): Promise<void> {
        try {
            const response = await browserControl.takeScreenshot(call, this.state);
            callback(null, response);
        } catch (e) {
            callback(e, null);
        }
    }

    async getBoundingBox(
        call: ServerUnaryCall<Request.ElementSelector>,
        callback: sendUnaryData<Response.Json>,
    ): Promise<void> {
        return getters.getBoundingBox(call, callback, this.state);
    }

    async getPageSource(call: ServerUnaryCall<Request.Empty>, callback: sendUnaryData<Response.String>): Promise<void> {
        return getters.getPageSource(call, callback, this.getActivePage());
    }

    async setTimeout(call: ServerUnaryCall<Request.Timeout>, callback: sendUnaryData<Response.Empty>): Promise<void> {
        return browserControl.setTimeout(call, callback, this.getActiveBrowser()?.context?.c);
    }

    async getTitle(call: ServerUnaryCall<Request.Empty>, callback: sendUnaryData<Response.String>): Promise<void> {
        return getters.getTitle(callback, this.getActivePage());
    }

    async getUrl(call: ServerUnaryCall<Request.Empty>, callback: sendUnaryData<Response.String>): Promise<void> {
        return getters.getUrl(callback, this.getActivePage());
    }

    async getElementCount(
        call: ServerUnaryCall<Request.ElementSelector>,
        callback: sendUnaryData<Response.Int>,
    ): Promise<void> {
        return getters.getElementCount(call, callback, this.state);
    }

    async getSelectContent(
        call: ServerUnaryCall<Request.ElementSelector>,
        callback: sendUnaryData<Response.Select>,
    ): Promise<void> {
        try {
            const response = await getters.getSelectContent(call, this.state);
            callback(null, response);
        } catch (e) {
            callback(e, null);
        }
    }

    async getDomProperty(
        call: ServerUnaryCall<Request.ElementProperty>,
        callback: sendUnaryData<Response.String>,
    ): Promise<void> {
        try {
            const response = await getters.getDomProperty(call, this.state);
            callback(null, response);
        } catch (e) {
            callback(e, null);
        }
    }

    async getBoolProperty(
        call: ServerUnaryCall<Request.ElementProperty>,
        callback: sendUnaryData<Response.Bool>,
    ): Promise<void> {
        try {
            const response = await getters.getBoolProperty(call, this.state);
            callback(null, response);
        } catch (e) {
            callback(e, null);
        }
    }

    async getElementAttribute(
        call: ServerUnaryCall<Request.ElementProperty>,
        callback: sendUnaryData<Response.String>,
    ): Promise<void> {
        return getters.getElementAttribute(call, callback, this.state);
    }

    async getStyle(
        call: ServerUnaryCall<Request.ElementSelector>,
        callback: sendUnaryData<Response.Json>,
    ): Promise<void> {
        return getters.getStyle(call, callback, this.state);
    }

    async getViewportSize(call: ServerUnaryCall<Request.Empty>, callback: sendUnaryData<Response.Json>): Promise<void> {
        return getters.getViewportSize(call, callback, this.getActivePage());
    }

    async selectOption(
        call: ServerUnaryCall<Request.SelectElementSelector>,
        callback: sendUnaryData<Response.Empty>,
    ): Promise<void> {
        try {
            const result = await interaction.selectOption(call, this.state);
            callback(null, result);
        } catch (e) {
            callback(e, null);
        }
    }

    async deselectOption(call: ServerUnaryCall<Request.ElementSelector>, callback: sendUnaryData<Response.Empty>) {
        return interaction.deSelectOption(call, callback, this.state);
    }

    async inputText(call: ServerUnaryCall<Request.TextInput>, callback: sendUnaryData<Response.Empty>): Promise<void> {
        return interaction.inputText(call, callback, this.state);
    }

    async typeText(call: ServerUnaryCall<Request.TypeText>, callback: sendUnaryData<Response.Empty>): Promise<void> {
        try {
            const result = await interaction.typeText(call, this.state);
            callback(null, result);
        } catch (e) {
            callback(e, null);
        }
    }

    async fillText(call: ServerUnaryCall<Request.FillText>, callback: sendUnaryData<Response.Empty>): Promise<void> {
        try {
            const result = await interaction.fillText(call, this.state);
            callback(null, result);
        } catch (e) {
            callback(e, null);
        }
    }

    async clearText(call: ServerUnaryCall<Request.ClearText>, callback: sendUnaryData<Response.Empty>): Promise<void> {
        try {
            const result = await interaction.clearText(call, this.state);
            callback(null, result);
        } catch (e) {
            callback(e, null);
        }
    }

    async press(call: ServerUnaryCall<Request.PressKeys>, callback: sendUnaryData<Response.Empty>): Promise<void> {
        try {
            const result = await interaction.press(call, this.state);
            callback(null, result);
        } catch (e) {
            callback(e, null);
        }
    }

    async click(
        call: ServerUnaryCall<Request.ElementSelectorWithOptions>,
        callback: sendUnaryData<Response.Empty>,
    ): Promise<void> {
        try {
            const result = await interaction.click(call, this.state);
            callback(null, result);
        } catch (e) {
            callback(e, null);
        }
    }

    async hover(
        call: ServerUnaryCall<Request.ElementSelectorWithOptions>,
        callback: sendUnaryData<Response.Empty>,
    ): Promise<void> {
        return interaction.hover(call, callback, this.state);
    }

    async focus(
        call: ServerUnaryCall<Request.ElementSelector>,
        callback: sendUnaryData<Response.Empty>,
    ): Promise<void> {
        return interaction.focus(call, callback, this.state);
    }

    async checkCheckbox(
        call: ServerUnaryCall<Request.ElementSelector>,
        callback: sendUnaryData<Response.Empty>,
    ): Promise<void> {
        return interaction.checkCheckbox(call, callback, this.state);
    }

    async uncheckCheckbox(
        call: ServerUnaryCall<Request.ElementSelector>,
        callback: sendUnaryData<Response.Empty>,
    ): Promise<void> {
        return interaction.uncheckCheckbox(call, callback, this.state);
    }

    async getElement(
        call: ServerUnaryCall<Request.ElementSelector>,
        callback: sendUnaryData<Response.String>,
    ): Promise<void> {
        return evaluation.getElement(call, callback, this.state);
    }

    async getElements(
        call: ServerUnaryCall<Request.ElementSelector>,
        callback: sendUnaryData<Response.Json>,
    ): Promise<void> {
        try {
            const result = await evaluation.getElements(call, this.state);
            callback(null, result);
        } catch (e) {
            callback(e, null);
        }
    }

    async addStyleTag(call: ServerUnaryCall<Request.StyleTag>, callback: sendUnaryData<Response.Empty>): Promise<void> {
        return evaluation.addStyleTag(call, callback, this.getActivePage());
    }

    async waitForElementsState(
        call: ServerUnaryCall<Request.ElementSelectorWithOptions>,
        callback: sendUnaryData<Response.Empty>,
    ): Promise<void> {
        return evaluation.waitForElementState(call, callback, this.state);
    }
    async waitForRequest(
        call: ServerUnaryCall<Request.HttpCapture>,
        callback: sendUnaryData<Response.String>,
    ): Promise<void> {
        return network.waitForRequest(call, callback, this.getActivePage());
    }
    async waitForResponse(
        call: ServerUnaryCall<Request.HttpCapture>,
        callback: sendUnaryData<Response.Json>,
    ): Promise<void> {
        return network.waitForResponse(call, callback, this.getActivePage());
    }
    async waitUntilNetworkIsIdle(
        call: ServerUnaryCall<Request.Timeout>,
        callback: sendUnaryData<Response.Empty>,
    ): Promise<void> {
        return network.waitUntilNetworkIsIdle(call, callback, this.getActivePage());
    }

    async waitForFunction(
        call: ServerUnaryCall<Request.WaitForFunctionOptions>,
        callback: sendUnaryData<Response.Json>,
    ): Promise<void> {
        try {
            const result = await evaluation.waitForFunction(call, this.state);
            callback(null, result);
        } catch (e) {
            callback(e, null);
        }
    }

    async waitForDownload(
        call: ServerUnaryCall<Request.FilePath>,
        callback: sendUnaryData<Response.Json>,
    ): Promise<void> {
        return network.waitForDownload(call, callback, this.getActivePage());
    }

    async executeJavascript(
        call: ServerUnaryCall<Request.JavascriptCode>,
        callback: sendUnaryData<Response.JavascriptExecutionResult>,
    ): Promise<void> {
        return evaluation.executeJavascript(call, callback, this.state);
    }

    async getPageState(
        call: ServerUnaryCall<Request.Empty>,
        callback: sendUnaryData<Response.JavascriptExecutionResult>,
    ): Promise<void> {
        return evaluation.getPageState(callback, this.getActivePage());
    }

    async health(call: ServerUnaryCall<Request.Empty>, callback: sendUnaryData<Response.String>): Promise<void> {
        const response = new Response.String();
        response.setBody('OK');
        callback(null, response);
        return;
    }

    async highlightElements(
        call: ServerUnaryCall<Request.ElementSelectorWithDuration>,
        callback: sendUnaryData<Response.Empty>,
    ): Promise<void> {
        return evaluation.highlightElements(call, callback, this.state);
    }

    async download(call: ServerUnaryCall<Request.Url>, callback: sendUnaryData<Response.String>): Promise<void> {
        return evaluation.download(call, callback, this.state);
    }

    async setViewportSize(
        call: ServerUnaryCall<Request.Viewport>,
        callback: sendUnaryData<Response.Empty>,
    ): Promise<void> {
        return browserControl.setViewportSize(call, callback, this.getActivePage());
    }

    async httpRequest(
        call: ServerUnaryCall<Request.HttpRequest>,
        callback: sendUnaryData<Response.Json>,
    ): Promise<void> {
        return network.httpRequest(call, callback, this.getActivePage());
    }

    async getDevice(call: ServerUnaryCall<Request.Device>, callback: sendUnaryData<Response.Json>): Promise<void> {
        return deviceDescriptors.getDevice(call, callback);
    }
    async getDevices(call: ServerUnaryCall<Request.Empty>, callback: sendUnaryData<Response.Json>): Promise<void> {
        return deviceDescriptors.getDevices(callback);
    }

    async uploadFile(call: ServerUnaryCall<Request.FilePath>, callback: sendUnaryData<Response.Empty>): Promise<void> {
        return interaction.uploadFile(call, callback, this.getActivePage());
    }

    async handleAlert(
        call: ServerUnaryCall<Request.AlertAction>,
        callback: sendUnaryData<Response.Empty>,
    ): Promise<void> {
        return interaction.handleAlert(call, callback, this.getActivePage());
    }

    async mouseMove(call: ServerUnaryCall<Request.Json>, callback: sendUnaryData<Response.Empty>): Promise<void> {
        return interaction.mouseMove(call, callback, this.getActivePage());
    }

    async mouseButton(
        call: ServerUnaryCall<Request.MouseButtonOptions>,
        callback: sendUnaryData<Response.Empty>,
    ): Promise<void> {
        return interaction.mouseButton(call, callback, this.getActivePage());
    }

    async keyboardKey(
        call: ServerUnaryCall<Request.KeyboardKeypress>,
        callback: sendUnaryData<Response.Empty>,
    ): Promise<void> {
        return interaction.keyboardKey(call, callback, this.getActivePage());
    }

    async keyboardInput(
        call: ServerUnaryCall<Request.KeyboardInputOptions>,
        callback: sendUnaryData<Response.Empty>,
    ): Promise<void> {
        return interaction.keyboardInput(call, callback, this.getActivePage());
    }

    async setOffline(call: ServerUnaryCall<Request.Bool>, callback: sendUnaryData<Response.Empty>): Promise<void> {
        return browserControl.setOffline(call, callback, this.getActiveContext());
    }

    async setGeolocation(call: ServerUnaryCall<Request.Json>, callback: sendUnaryData<Response.Empty>): Promise<void> {
        return browserControl.setGeolocation(call, callback, this.getActiveContext());
    }

    async reload(call: ServerUnaryCall<Request.Empty>, callback: sendUnaryData<Response.Empty>): Promise<void> {
        return browserControl.reload(call, callback, this.getActivePage());
    }
}
