import { GeoServerRestApi } from "./typescript-geoserver-rest-api/src/GeoServerRestApi";

export class GeoServerAnimationApi {

    gsRestApi: GeoServerRestApi;

    constructor(geoserverUrl: string) {
        this.gsRestApi = new GeoServerRestApi(geoserverUrl);
    }


    asyncLoadAnimation(workspace: string, name: string): Promise<any> {
        
        return new Promise((resolve, reject) => {
            this.gsRestApi.asyncLoadLayerGroup(workspace, name).then((result: any) => {

                if (typeof result == "undefined") {
                    console.error("Failed to get animation " + workspace + ":" + name);
                    reject();
                }

                // Attach URL of GeoServer source:
                result.geoServerUrl = this.gsRestApi.geoServerUrl;

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
              
                let promises = [];

                for (let ws of workspaces) {
                    promises.push(this.gsRestApi.asyncLoadLayerGroup(ws.name, ws.name));
                }

                Promise.all(promises).then((layerGroups: any) => {

                    console.log(layerGroups);
                    for(let lg of layerGroups) {
                        if (lg != null) {
                            result.push(lg);
                        }
                    }

                    resolve(result);
                });
            });
        });
    }


    asyncLoadAnimationWorkspaces(prefix: string): Promise<Array<any>> {

        return new Promise((resolve, reject) => {

            this.gsRestApi.asyncloadWorkspaces().then((workspaces: any) => {

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
