<template>
    <div class="geoserver-animations-list">
        <ul>
            <li v-for="anim in animations" @click="onAnimationClicked(anim, $event)">{{anim.title}}</li>
        </ul>
    </div>
</template>

<script lang="ts">

import { GeoServerAnimationApi } from './GeoServerAnimationApi'

import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class AnimationsList extends Vue {

    // TODO: 2 Pass URLs as props

    //################# BEGIN Configuration member variables ###################
    cfg_geoServerUrl: URL = new URL("http://vmsdkarma.geomer.de/geoserver");
    cfg_proxyUrl: URL | null = new URL("http://localhost/proxy.php?csurl=");
    //################# END Configuration member variables ###################

    private animations: any = [];

    created() {
        var gsanim = new GeoServerAnimationApi(this.cfg_geoServerUrl, this.cfg_proxyUrl);

        gsanim.loadAnimationsFromAllWorkspaces((result: any) => {

            for (let lg of result) {

                gsanim.loadAnimationAsync(lg.name, lg.name, (animDetailInfo: any) => {
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
div.geoserver-animations-list {}
</style>