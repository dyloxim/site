import { default as Color } from "@IFS/display/util/color";
import { default as Display } from "@IFS/display/displayApperatus";
import { default as Vec } from "@IFS/math/linearAlgebra/vec2"
import { default as SessionMutation } from "@IFS/execution/sessionMutation";

import { I_displayConfig, I_settings } from "@IFS/types/configuration";
import { I_applicationState, I_sessionState } from "@IFS/types/state";

import * as Globals from "@IFS/resources/globalConstants"
import { I_selectableEntityMetaData, SelectableEntityCategory } from "@IFS/types/interaction";

export default class Util {

  // .............................................................................
  // IFS process related
  // .............................................................................

  // calculations ---------------------------------------------------------------


  static getWeightedRandomChoice = (weights: number[], randomFn: () => number): number => {

    let probabilitySum = weights[0]
    let regions = weights.slice();
    for (let i = 1; i < weights.length; i++) {
      probabilitySum += weights[i]
      regions[i] = probabilitySum;
    }
    let dart = randomFn()
    let choice = 0
    for (let i = 0; i < weights.length; i++) {
      if (regions[i] > dart) { choice = i; break; }
    }
    return choice;

  }


  // convenience ----------------------------------------------------------------

  static getRandomSeed = (): number => {
    return (Math.random()*2**32)>>>0;
  }

  static xoshiro128ss = (a: number, b: number, c: number, d: number): () => number => {
    return function() {
      let t = b << 9, r = b * 5;
      r = (r << 7 | r >>> 25) * 9;
      c ^= a;
      d ^= b;
      b ^= c;
      a ^= d;
      c ^= t;
      d = d << 11 | d >>> 21;
      return (r >>> 0) / 4294967296;
    }
  }
  

  static getThisTurnColor = (settings: I_settings, state: I_sessionState): Color => {

    if (state.options.color) {

      return settings.display.color.palette.colors[state.program.thisTurn.choice];

    } else return settings.display.color.base;

  }




  
  // .............................................................................
  // display proportions / sizes
  // .............................................................................



  // calculations ---------------------------------------------------------------


  static getVertRadius = (config: I_displayConfig): number => {

    return config.domain.displayRadius * Globals.vertRadiusDisplayRatio
      * (
        config.tacit.isMobile ? 2 : 1
      )

  }
  

  static getVertPixelRadius = (settings: I_settings, display: Display): number => {

    return display.rig.projectLength(Util.getVertRadius(settings.display))

  }


  static getSelectionRadius = (settings: I_settings): number => {

    return Globals.selectionRadiusDisplayRatio
      * (
        settings.display.tacit.isMobile ? 3 : 1
      )

  }


  static getSelectionPixelRadius = (appState: I_applicationState): number => {

    return appState.display.rig.projectLength(
      Util.getSelectionRadius(appState.session.settings
      ));

  }









  
  
  // .............................................................................
  // interaction data
  // .............................................................................



  // calculations ---------------------------------------------------------------


  static processEntityCategoryProximities = (
    app: I_applicationState,
    category: SelectableEntityCategory
  ): null | I_selectableEntityMetaData => {

    let proximalEntity: null | I_selectableEntityMetaData = null;

    app.session = new SessionMutation({ using: app.session, do: s => {


      s.state.selectableEntities[category].forEach((entity, i) => {

        // update value
        let isProximal = Util.mouseIsProximal(app, entity.pos); 
        entity.isProximal = isProximal;

        if (isProximal && proximalEntity == null) {
          proximalEntity = entity;
        }

        return entity;

      })

      return s;

    }}).eval()

    return proximalEntity;
  }


  static getCurrentTarget = (app: I_applicationState): null | I_selectableEntityMetaData => {

    return Globals.SelectableEntityCategories
      .map(category => { return Util.processEntityCategoryProximities(app, category); })
      .reduce((a, b) => { return b ?? a });

  }

  
  static getControlPointOffset = (app: I_applicationState): null | number[] => {

    let candidate = app.session.state.mouse.interactionCandidate!;

    if (candidate != undefined) {

      return Vec.minus(
        app.display.rig.reverseProject(app.session.state.mouse.pos),
        candidate.pos
      );

    } else return null

  }


  static getHighlightCandidate = (
    app: I_applicationState
  ): I_selectableEntityMetaData | null => {

    if (app.session.state.mouse.interactionCandidate != null) {

      return app.session.state.mouse.interactionCandidate;

    } else return null;

  }


  static mouseDragVector(app: I_applicationState): number[] {

    return Vec.minus( // change in mouse position

      app.display.rig.reverseProject(app.session.state.mouse.down!),
      app.display.rig.reverseProject(app.session.state.mouse.pos)

    );

  }

  
  static getTargetColor(app: I_applicationState, target: I_selectableEntityMetaData): Color {

    return Util.getPalette(app)[target.id[0]];

  }


  static getSelectionControlPoints = (
    app: I_applicationState
  ): I_selectableEntityMetaData[] | null => {
    
    let i = app.session.state.selected[0];
    let target = app.session.state.selectableEntities.primaryControlPoints[i];
    let entities = null;

    if (target != null) {

      let i = target.id[0]
      let K = app.FS.controlPoints[i];

      entities = K.basis .map((v, j) => {

        return {
          id: [i, j],
          type: "secondaryControlPoints" as SelectableEntityCategory,
          pos: Vec.add(K.origin, v),
          isProximal: false
        }});

    } 

    return entities;

  }



  // checks / flags -------------------------------------------------------------


  static entitiesEqual = (
    selection: I_selectableEntityMetaData | null, target: I_selectableEntityMetaData | null
  ) => {

    return (JSON.stringify(selection) == JSON.stringify(target));

  }


  static interactionDecisionTimedOut = (app: I_applicationState): boolean => {

    let timeSinceMouseDown = (Date.now() - app.session.state.mouse.actionUndecided!)
    return (timeSinceMouseDown > Globals.decisionTimeoutThreshold);

  }


  static affirmState__FSinteractionPossible = (app: I_applicationState): boolean => {

    return (!!app.session.state.mouse.actionUndecided
      && app.session.state.mouse.interactionCandidate != null)

  }


  static mouseIsProximal(app: I_applicationState, entityPos: number[]): boolean {

    let mousePixelPos = app.session.state.mouse.pos;
    let positionDifference = Vec.dist(app.display.rig.reverseProject(mousePixelPos), entityPos)
    let displayRadius = app.session.settings.display.domain.displayRadius;
    return (positionDifference < Util.getSelectionRadius(app.session.settings) * displayRadius);

  }


  static targetEqualsSelection = (
    app: I_applicationState, target: I_selectableEntityMetaData | null
  ) => {

    return target!.type == "primaryControlPoints" ? (
      target!.id[0] == app.session.state.selected[0]
    ) : false;

  }


  

  // .............................................................................
  // common conveniences
  // .............................................................................


  static getPalette(app: I_applicationState) {

    return app.session.settings.display.color.palette.colors;

  }


}
