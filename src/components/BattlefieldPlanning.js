import { useEffect, useRef, useState, useCallback } from 'react';
import {
  BATTLEFIELD_SIDES,
  COLOR_SCHEMA,
  GAME_STAGES,
  INITIAL_BATTLEFIELD_SETUP,
  SHIP_DETAILS,
} from '@/libs/config';
import {
  buildTableContent,
  getGenericFleet,
  getVirtualAffectedCells,
  isShipPlacementValid,
} from '@/libs/helpers';
import BattlefieldSettings from './BattlefieldSettings';

export default function BattlefieldPlanning({
  actions: { onChange },
  gameState,
  isPc = false,
}) {
  const [battlefield, setBattlefield] = useState(INITIAL_BATTLEFIELD_SETUP);
  const battlefieldTable = useRef();
  const isMenuState = battlefield.stage === GAME_STAGES.menu;
  const isPlanningStage = battlefield.stage === GAME_STAGES.planning;

  const resetBattleFieldOngoingProcess = useCallback(() => {
    const cells = battlefieldTable.current.querySelectorAll('td');
    cells.forEach((el) => el.classList.remove(COLOR_SCHEMA.hover));
  }, []);

  const handleBattlefieldClick = useCallback(
    (e) => {
      if (!isPlanningStage) {
        return;
      }
      if (e.target.tagName !== 'TD') {
        return;
      }

      const affectedCells = getVirtualAffectedCells({
        colunnIndex: Number(e.target.dataset.index),
        rowIndex: Number(e.target.dataset.row),
        ship: battlefield.currentShip,
        isHorizontalPlacement: battlefield.horizontalPlacement,
        shipColor: battlefield.currentShip.color,
      });

      if (
        !isShipPlacementValid({
          affectedCells,
          fleet: battlefield.fleet,
          ship: battlefield.currentShip,
        })
      ) {
        return;
      }

      const nextShipIndex = battlefield.currentShipIndex + 1;
      const isNextShipAvailable = battlefield.shipDetails[nextShipIndex];

      setBattlefield({
        ...battlefield,
        stage: isNextShipAvailable
          ? battlefield.stage
          : GAME_STAGES.planningComplete,
        currentShipIndex: nextShipIndex,
        currentShip: battlefield.shipDetails[nextShipIndex],
        fleet: [
          ...battlefield.fleet,
          {
            ...battlefield.currentShip,
            position: affectedCells,
          },
        ],
      });
    },
    [battlefield, isPlanningStage]
  );

  const hightlightShipOnBattlefield = (target) => {
    if (!target || !isPlanningStage) return;
    resetBattleFieldOngoingProcess();

    const cells = getVirtualAffectedCells({
      colunnIndex: Number(target.dataset.index),
      rowIndex: Number(target.dataset.row),
      ship: battlefield.currentShip,
      isHorizontalPlacement: battlefield.horizontalPlacement,
      shipColor: battlefield.currentShip.color,
    })
      .map((el) =>
        battlefieldTable.current.querySelector(
          `td[data-index="${el.x}"][data-row="${el.y}"]`
        )
      )
      .filter(Boolean);

    cells.map((el) => {
      el.classList.add(COLOR_SCHEMA.hover);
    });
  };

  const onMouseEnterBattlefield = (e) => {
    if (e.target.tagName !== 'TD') {
      return;
    }
    hightlightShipOnBattlefield(e.target);
  };

  const resetFleet = () => {
    setBattlefield(INITIAL_BATTLEFIELD_SETUP);
    const cells = battlefieldTable.current.querySelectorAll('td');

    SHIP_DETAILS.map((el) => el.color).forEach((color) => {
      cells.forEach((el) => {
        el.classList.remove(color);
      });
    });
  };

  const onReady = () => {
    setBattlefield({
      ...battlefield,
      stage: GAME_STAGES.ready,
    });

    onChange({ ...gameState, [isPc ? BATTLEFIELD_SIDES.enemy : BATTLEFIELD_SIDES.player]: battlefield });
  };

  const genericFleet = () => {
    const fleet = getGenericFleet(battlefield);

    setBattlefield({
      ...battlefield,
      stage: isPc ? GAME_STAGES.ready : GAME_STAGES.planningComplete,
      currentShip: null,
      currentShipIndex: battlefield.shipDetails.length,
      fleet,
    });
  };

  const autoGenerate = () => {
    resetFleet();
    genericFleet();
  };

  const onPositionChange = () => {
    setBattlefield({
      ...battlefield,
      horizontalPlacement: !battlefield.horizontalPlacement,
    });
  };

  // EFFECTS
  useEffect(() => {
    if (!isPc) {
      return;
    }
    genericFleet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // propagate changes to the parent
  useEffect(() => {
    onChange({ ...gameState, [isPc ? BATTLEFIELD_SIDES.enemy : BATTLEFIELD_SIDES.player]: battlefield });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battlefield.stage]);

  // highlight ship on the battlefield
  useEffect(() => {
    if (!battlefield.fleet.length) {
      return;
    }
    // hide PC fleet
    if (isPc) {
      return;
    }

    battlefield.fleet.map((el) => {
      el.position.map((ship) => {
        let cell = ship.ref;

        if (!cell) {
          cell = battlefieldTable.current.querySelector(
            `td[data-index="${ship.x}"][data-row="${ship.y}"]`
          );
        }
        if (!cell) {
          return;
        }

        cell.classList.add(ship.shipColor);
      });
    });
  }, [battlefield.fleet, isPc]);

  return (
    <div>
      <h4 className="text-2xl font-bold dark:text-white text-center my-2">
        {isPc ? 'PC' : 'Player'}
      </h4>

      <table
        ref={battlefieldTable}
        // className={`m-0 border-spacing-0.5 border-separate ${COLOR_SCHEMA.empty}`}
        className={`m-0 border-spacing-0.5 border-separate`}
        onClick={handleBattlefieldClick}
        onMouseMove={onMouseEnterBattlefield}
        onMouseLeave={() => resetBattleFieldOngoingProcess()}
      >
        {buildTableContent()}
      </table>

      {!isPc ? (
        <BattlefieldSettings
          gameState={battlefield}
          actions={{
            onReset: resetFleet,
            autoGenerate,
            onPositionChange,
            onReady,
          }}
        />
      ) : null}
    </div>
  );
}