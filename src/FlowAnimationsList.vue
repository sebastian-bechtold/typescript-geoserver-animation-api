<template>
    <div class="flow-animations-list">        
        <ul>
            <li v-for="anim in animations" @click="onAnimationClicked(anim, $event)">{{anim.title}}</li>
        </ul>
    </div>
</template>

<script lang="ts">

import { GeoServerAnimationApi } from './GeoServerAnimationApi'
import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class FlowAnimationsList extends Vue {

    //################# BEGIN Props ###################
    @Prop()
    geoServerUrl: string;

    @Prop()
    proxyUrl: string;
    //################# END Props ###################

    private animations: Array<any> = [];

    created() {
        let gsanim = new GeoServerAnimationApi(this.geoServerUrl, this.proxyUrl);

        let prefix = "flow_";
        

        // NOTE: Animations are layer groups. Thus, GeoServerAnimationApi::loadAnimationsFromAllWorkspaces() returns
        // a list of layer groups!
        gsanim.loadAnimationsFromAllWorkspaces(prefix, (result: any) => {

            for (let layerGroup of result) {

                gsanim.loadAnimationAsync(layerGroup.name, layerGroup.name, (animDetailInfo: any) => {
                    this.animations.push(animDetailInfo);
                });
            }
        });
    }

    onAnimationClicked(animation: any, event: MouseEvent) {
        this.$emit('input', animation);
    }

}
</script>

<style lang="scss">
div.flow-animations-list {

    ul {
        margin: 0;
        padding: 0;
        list-style: none;

        >li {
            border-bottom: 1px solid #ccc;
            padding: 8px;

            &:hover {
                background-color: #eee;
                cursor: pointer;
            }
        }
    }
}
</style>