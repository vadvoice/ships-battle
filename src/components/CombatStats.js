import { Badge, Tooltip } from 'flowbite-react';
import { motion } from 'framer-motion';

export const CombatStats = ({ player }) => {
  const { fleet } = player;
  if (!fleet) {
    return <></>;
  }

  return (
    <div className="flex flex-wrap my-2 justify-between">
      {/* show a list with damaged or not ships */}
      {fleet.map((ship, index) => {
        return (
          <motion.div
            key={player.name + ship.name + index}
            initial={{ x: '0' }}
            whileHover={{ scale: 1.1 }}
          >
            <div className={`${ship.color} capitalize rounded p-1`}>
              {ship.name}
              <div className="flex">
                {ship.isDamaged ? (
                  <Tooltip content="Damaged">
                    <Badge className="w-2 h-2" color="warning" />
                  </Tooltip>
                ) : null}
                {ship.isSunk ? (
                  <Tooltip content="Sunk">
                    <Badge className="w-2 h-2" color="failure" />
                  </Tooltip>
                ) : null}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
