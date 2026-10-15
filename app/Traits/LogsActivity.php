<?php

namespace App\Traits;

use App\Services\ActivityLogger;

/** Optional: `use LogsActivity;` on Product, Order, etc. to audit them automatically. */
trait LogsActivity
{
    public static function bootLogsActivity(): void
    {
        static::created(fn ($m) => ActivityLogger::log('created', "{$m->activityLogName()} #{$m->getKey()} was created", $m));

        static::updated(function ($m) {
            $changes = array_keys(array_diff_key($m->getChanges(), ['updated_at' => 1]));
            if ($changes) {
                ActivityLogger::log('updated', "{$m->activityLogName()} #{$m->getKey()} was updated", $m, ['changed' => $changes]);
            }
        });

        static::deleted(fn ($m) => ActivityLogger::log('deleted', "{$m->activityLogName()} #{$m->getKey()} was deleted", $m));
    }

    public function activityLogName(): string
    {
        return class_basename($this);
    }
}
