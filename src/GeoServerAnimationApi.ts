// TODO: 2 Add support for request failure handlers
// TODO: 3 Use promises


import { GeoServerRestApi } from "./typescript-geoserver-rest-api/src/GeoServerRestApi";

export class GeoServerAnimationApi {

    gsRestApi: GeoServerRestApi;

    constructor(geoserverUrl: string, proxyUrl: string) {
        this.gsRestApi = new GeoServerRestApi(geoserverUrl, proxyUrl);

    }


    loadAnimationAsync(workspace: string, name: string, handler: any) {

        let me = this;

        this.gsRestApi.loadLayerGroupAsync(workspace, name, function (result: any) {

            if (typeof result == "undefined") {
                console.error("Failed to get animation " + workspace + ":" + name);
                return;
            }

            // Attach URL of GeoServer source:
            result.geoServerUrl = me.gsRestApi.geoServerBaseUrl;

            handler(result);
        });
    }


    // getAnimations looks for animation group layers in the passed workspace
    loadAllAnimationsFromWorkspaceAsync(workspace: string, prefix: string, handler: any) {

        this.gsRestApi.loadLayerGroupListAsync(workspace, (layerGroups: any) => {

            let result = [];

            //###### BEGIN Loop over list of layer groups and filter out those that are animations ######            
            for (let lg of layerGroups.layerGroups.layerGroup) {

                if (lg.name.startsWith(prefix)) {
                    result.push(lg);
                }
            }
            //###### END Loop over list of layer groups and filter out those that are animations ######

            handler(result);
        });
    }


    // getAnimations2 loops through all workspaces with a name that begins with the passed prefix and picks
    // from each of those workspaces the one group layer that has the same name as the workspace.
    loadAnimationsFromAllWorkspaces(prefix: string, handler: any) {

        this.loadAnimationWorkspacesAsync(prefix, (workspaces: any) => {

            let result: Array<any> = [];

            let numAnims = workspaces.length;
            let count = 0;

            for (let ws of workspaces) {

                this.gsRestApi.loadLayerGroupAsync(ws.name, ws.name, function (layerGroup: any) {

                    // TODO: 2 What if a request fails?
                    result.push(layerGroup);
                    count++;

                    if (count == numAnims) {
                        console.log("All animations loaded!");
                        handler(result);
                    }
                });

            }
        });
    }


    loadAnimationWorkspacesAsync(prefix: string, handler: any) {

        this.gsRestApi.loadWorkspacesAsync((workspaces: any) => {

            let result = [];

            //###### BEGIN Loop over list of workspaces and filter out those that are animations ######            
            for (let ws of workspaces) {

                if (ws.name.startsWith(prefix)) {
                    result.push(ws);
                }
            }
            //###### END Loop over list of workspaces and filter out those that are animations ######

            handler(result);
        });
    }
}
