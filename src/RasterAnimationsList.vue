<template>
    <div class="raster-animations-list">
        <ul>
            <li v-for="anim in animations" @click="onAnimationClicked(anim, $event)">
                <h3>{{anim.title}}</h3>
                <br/>
                
                <table>
                    <tr><td>Author:</td><td>{{anim.abstract.author}}</td></tr>
                    <tr><td>Description:</td><td>{{anim.abstract.description}}</td></tr>
                    <tr><td>Intervalldauer:</td><td>{{anim.abstract.saveIntervalSec}} Seconds</td></tr>
                </table>

            </li>
        </ul>
    </div>
</template>

<script lang="ts">

import { GeoServerAnimationApi } from './GeoServerAnimationApi'
import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class RasterAnimationsList extends Vue {

    //################# BEGIN Props ###################
    @Prop()
    geoServerUrl: string;
    //################# END Props ###################

    private animations: any = [];

    created() {
        var gsanim = new GeoServerAnimationApi(this.geoServerUrl);

        let prefix = "anim_";

        gsanim.asyncLoadAnimationsFromAllWorkspaces(prefix).then((result: any) => {

            for (let lg of result) {
                if (lg != null) {
                    gsanim.asyncLoadAnimation(lg.name, lg.name).then((animDetailInfo: any) => {
                        
                       
                        this.animations.push(animDetailInfo);
                    });
                }
            }
        });
    }

    onAnimationClicked(animation: any, event: MouseEvent) {
        this.$emit('input', animation);
    }

}
</script>

<style lang="scss">
div.raster-animations-list {

    ul {
        margin: 0;
        padding: 0;
        list-style: none;

        >li {
            border-bottom: 1px solid #ccc;
            padding: 8px;

            h3 {
                font-size:18px;
                margin:0;
            }

            &:hover {
                background-color: #eee;
                cursor: pointer;
            }
        }
    }
}
</style>