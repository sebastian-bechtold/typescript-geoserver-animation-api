import { GeoServerRestApi } from "./typescript-geoserver-rest-api/src/GeoServerRestApi";

export class GeoServerAnimationApi {

    gsRestApi: GeoServerRestApi;

    constructor(geoserverUrl: string, proxyUrl: string) {
        this.gsRestApi = new GeoServerRestApi(geoserverUrl, proxyUrl);

    }


    asyncLoadAnimation(workspace: string, name: string): Promise<any> {
        
        return new Promise((resolve, reject) => {
            this.gsRestApi.asyncLoadLayerGroup(workspace, name).then((result: any) => {

                if (typeof result == "undefined") {
                    console.error("Failed to get animation " + workspace + ":" + name);
                    reject();
                }

                // Attach URL of GeoServer source:
                result.geoServerUrl = this.gsRestApi.geoServerBaseUrl;

                resolve(result);
            });
        });
    }


    // getAnimations looks for animation group layers in the passed workspace
    asyncLoadAllAnimationsFromWorkspaceAsync(workspace: string, prefix: string): Promise<any> {

        return new Promise((resolve, reject) => {
            this.gsRestApi.asyncLoadLayerGroupList(workspace).then((layerGroups: any) => {

                let result = [];

                //###### BEGIN Loop over list of layer groups and filter out those that are animations ######            
                for (let lg of layerGroups.layerGroups.layerGroup) {

                    if (lg.name.startsWith(prefix)) {
                        result.push(lg);
                    }
                }
                //###### END Loop over list of layer groups and filter out those that are animations ######

                resolve(result);
            });
        });
    }


    // getAnimations2 loops through all workspaces with a name that begins with the passed prefix and picks
    // from each of those workspaces the one group layer that has the same name as the workspace.
    asyncLoadAnimationsFromAllWorkspaces(prefix: string): Promise<any> {

        return new Promise((resolve, reject) => {
            // NOTE: loadAnimationsWorkspacesAsync() returns all workspaces 
            // with a name that begins with the passed prefix.
            this.asyncLoadAnimationWorkspaces(prefix).then((workspaces: any) => {

                let result: Array<any> = [];

                let numAnims = workspaces.length;
                let count = 0;

                // TODO: 2 Try to make this more simple and fail-safe unsing promises.

                //############ BEGIN Loop over workspaces ##############
                for (let ws of workspaces) {

                    this.gsRestApi.asyncLoadLayerGroup(ws.name, ws.name).then((layerGroup: any) => {

                        if (layerGroup != null) {
                            result.push(layerGroup);
                        }

                        count++;

                        if (count == numAnims) {
                            console.log("All animations loaded!");
                            resolve(result);
                        }
                    });
                }
                //############ END Loop over workspaces ##############
            });
        });
    }


    asyncLoadAnimationWorkspaces(prefix: string): Promise<Array<any>> {

        return new Promise((resolve, reject) => {

            this.gsRestApi.loadWorkspacesAsync().then((workspaces: any) => {

                let result = [];

                //###### BEGIN Loop over list of workspaces and filter out those that are animations ######            
                for (let ws of workspaces) {

                    if (ws.name.startsWith(prefix)) {
                        result.push(ws);
                    }
                }
                //###### END Loop over list of workspaces and filter out those that are animations ######

                resolve(result);
            });
        });
    }
}
