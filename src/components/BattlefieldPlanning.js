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
import { motion, useAnimate } from 'framer-motion';

export default function BattlefieldPlanning({
  data: { isMobile, isPc = false, socket = null, gameState },
  actions: { onChange },
}) {
  const [scope, animate] = useAnimate();
  const initialBattlefieldSetup = {
    name: isPc ? 'PC' : gameState.name,
    role: isPc ? BATTLEFIELD_SIDES.enemy : gameState.role,
    ...INITIAL_BATTLEFIELD_SETUP,
  };
  const [battlefield, setBattlefield] = useState(initialBattlefieldSetup);
  const battlefieldTable = useRef();
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

  const resetFleet = async () => {
    setBattlefield(initialBattlefieldSetup);
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
  };

  const genericFleet = async () => {
    const fleet = getGenericFleet(battlefield);

    // TODO: should i move it to the helpers or some sort of animation sets?
    await animate('table', { y: 0 }, { duration: 0.1, ease: 'easeInOut' });
    await animate(
      'table',
      { y: 10, rotate: Math.round(Math.random()) ? 10 : -10, scale: 0.85 },
      { duration: 0.3, ease: 'easeInOut' }
    );

    setBattlefield({
      ...battlefield,
      stage: isPc ? GAME_STAGES.ready : GAME_STAGES.planningComplete,
      currentShip: null,
      currentShipIndex: battlefield.shipDetails.length,
      fleet,
    });
    await animate(
      'table',
      { y: 0, rotate: 0, scale: 1 },
      { duration: 0.1, ease: 'easeOut' }
    );
  };

  const autoGenerate = () => {
    resetFleet(true);
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
    const nextGameState = {
      ...gameState,
      [isPc ? BATTLEFIELD_SIDES.enemy : gameState.role]: battlefield,
    };
    onChange(nextGameState);

    // TODO: potentially memory leak
    socket && socket.emit('user_send_planning_action', nextGameState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battlefield]);

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
    <div
      className={`${isPc ? 'hidden' : ''} flex flex-col items-center`}
      ref={scope}
    >
      <h4 className="text-2xl font-bold dark:text-white text-center my-2">
        {isPc ? 'PC' : gameState.name}
      </h4>

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: '0' }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
      >
        <table
          ref={battlefieldTable}
          className={`m-0 border-spacing-0.5 border-separate`}
          onClick={handleBattlefieldClick}
          onMouseMove={onMouseEnterBattlefield}
          onMouseLeave={() => resetBattleFieldOngoingProcess()}
        >
          {buildTableContent({ isMobile })}
        </table>
      </motion.div>

      {!isPc ? (
        <BattlefieldSettings
          data={{ battlefield, isMobile }}
          actions={{
            // TODO: redo...xd xd xd
            onReset: async () => {
              await animate(
                'table',
                {
                  y: 10,
                  rotate: Math.round(Math.random())
                    ? -Math.round(Math.random() * 100)
                    : Math.round(Math.random() * 100),
                  scale: 0.85,
                },
                { duration: 0.1, ease: 'easeInOut' }
              );
              resetFleet();

              await animate(
                'table',
                {
                  y: 10,
                  rotate: Math.round(Math.random())
                    ? -Math.round(Math.random() * 100)
                    : Math.round(Math.random() * 100),
                  scale: 0.85,
                },
                { duration: 0.1, ease: 'easeInOut' }
              );
              await animate('table', { y: 0, x: 0, rotate: 0, scale: 1 });
            },
            autoGenerate,
            onPositionChange,
            onReady,
          }}
        />
      ) : null}
    </div>
  );
}
