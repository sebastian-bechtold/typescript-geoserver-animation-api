// TODO: 3 Use promises

import {GeoServerRestApi} from "./typescript-geoserver-rest-api/src/GeoServerRestApi";

export class GeoServerAnimationApi {

    gsRestApi: GeoServerRestApi;
   
    constructor(geoserverUrl: URL, proxyUrl : URL | null, username : string, password : string) {
        this.gsRestApi = new GeoServerRestApi(geoserverUrl, proxyUrl, username, password);            
    }


    loadAnimationAsync(workspace : string, name : string, handler : any) {
        
        let me = this;
        
        this.gsRestApi.loadLayerGroupAsync(workspace, name, function(result : any) {                        

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
    loadAllAnimationsFromWorkspaceAsync(workspace: string, handler : any) {
        
        this.gsRestApi.loadLayerGroupListAsync(workspace, function (layerGroups : any) {
            
            let result = [];

            //###### BEGIN Loop over list of layer groups and filter out those that are animations ######            
            for (let lg of layerGroups.layerGroups.layerGroup) {                                                
                
                if (lg.name.startsWith("anim_")) {
                    result.push(lg);                
                }
            }
            //###### END Loop over list of layer groups and filter out those that are animations ######
            
            handler(result);
        });                
    }
    
    
    // getAnimations2 loops through all workspaces with a name that begins with "anim_" and picks
    // from each of those workspaces the one group layer that has the same name as the workspace.
    loadAnimationsFromAllWorkspaces(handler : any) {
        
        let me = this;
        
        this.loadAnimationWorkspacesAsync(function(workspaces : any) {                       
            
            let result : Array<any> = [];
            
            let numAnims = workspaces.length;
            let count = 0;
                                    
            for(let ws of workspaces) {
                                              
                me.gsRestApi.loadLayerGroupAsync(ws.name, ws.name, function(lg : any) {

                    // TODO: 2 What if a request fails?
                    result.push(lg);
                    count++;

                    if (count == numAnims) {
                        console.log("All animations loaded!");
                        handler(result);
                    }
                });
                
            }            
        });
    }
    
    // TODO: 3 Move name filtering to GeoServerRestReader API
    loadAnimationWorkspacesAsync(handler : any) {
        
        this.gsRestApi.loadWorkspacesAsync(function (workspaces : any) {
                                         
            let result = [];
            
            //###### BEGIN Loop over list of workspaces and filter out those that are animations ######            
            for (let ws of workspaces) {
                                                
                if (ws.name.startsWith("anim_")) {
                    result.push(ws);                
                }
            }
            //###### END Loop over list of workspaces and filter out those that are animations ######
                                               
            handler(result);
        });                
    }
}
