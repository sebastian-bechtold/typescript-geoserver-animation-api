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


                // This is the hard-coded, initial default abstract:
                result.abstract = {
                    "uuid": "undefined", 
                    "customer": "undefined", 
                    "author": "undefined", 
                    "description": "No description provided", 
                    "simulationLengthSec": -1, 
                    "saveIntervalSec": 600, 
                    "faVersion": "1.0.0.0", 
                    "faLicense": null, 
                    "mode": null, 
                    "nameEn": null, 
                    "nameDe": null, 
                    "dem": null, 
                    "demUnits": null, 
                    "barrier": null, 
                    "roughness": null, 
                    "language": null, 
                    "aboveSurface": false, 
                    "velocities": false, 
                    "continueRaster": 0, 
                    "wktGeometry": 
                    "SRID=EPSG:3857;POLYGON ((987818.8199599204 6137657.883410599, 989704.3402626155 6137657.883410599, 989704.3402626155 6139947.90537729, 987818.8199599204 6139947.90537729, 987818.8199599204 6137657.883410599))" 
                }
                

                let ta = null;

                try {
                    ta = JSON.parse(result.abstractTxt);
                }
                catch(e) {

                }

                if (ta != null) {
                    console.log("here we go!");

                    if (typeof ta.customer != "undefined") {
                        result.abstract.customer = ta.customer;
                    }

                    if (typeof ta.author != "undefined") {
                        result.abstract.author = ta.author;
                    }

                    if (typeof ta.description != "undefined") {
                        result.abstract.description = ta.description;
                    }
                    
                    if (typeof ta.simulationLengthSec != "undefined") {
                        result.abstract.simulationLengthSec = ta.simulationLengthSec;
                    }

                    if (typeof ta.saveIntervalSec != "undefined") {
                        result.abstract.saveIntervalSec = ta.saveIntervalSec;
                    }

                    // TODO: 4 Copy the remaining attributes, too?
                }
                //let trueAbstract = JSON.parse(result.abstractTxt);
                

                // TODO: 2 Read true values from actual abstract JSON

                // Example abstract JSON:
                /*
                let bla = { "uuid": "3f3cb4f3-f7b2-418d-a9a2-ba3e4477c8dd", 
                            "customer": "geomer", 
                            "author": "Master of Disaster", 
                            "description": "Geht doch", 
                            "simulationLengthSec": 10800, 
                            "saveIntervalSec": 600, 
                            "faVersion": "1.0.0.0", 
                            "faLicense": null, 
                            "mode": null, 
                            "nameEn": null, 
                            "nameDe": null, 
                            "dem": null, 
                            "demUnits": null, 
                            "barrier": null, 
                            "roughness": null, 
                            "language": null, 
                            "aboveSurface": false, 
                            "velocities": false, 
                            "continueRaster": 0, 
                            "wktGeometry": "SRID=EPSG:3857;POLYGON ((987818.8199599204 6137657.883410599, 989704.3402626155 6137657.883410599, 989704.3402626155 6139947.90537729, 987818.8199599204 6139947.90537729, 987818.8199599204 6137657.883410599))" 
                        }
                */

                console.log(result);

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

                // TODO: 2 What if not all promises are resolved? With the current solution, the entire load request
                // will fail and nothing will be returned, but is this what we want?
                Promise.all(promises).then((layerGroups: any) => {
                    
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
