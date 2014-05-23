<?php

/**
 * @file
 * Contains \Drupal\entity_embed\Plugin\entity_embed\plugin\DrupalEntity.
 */

namespace Drupal\entity_embed\Plugin\CKEditorPlugin;

use Drupal\ckeditor\CKEditorPluginBase;
use Drupal\editor\Entity\Editor;

/**
 * Defines the "drupalentity" plugin.
 *
 * @CKEditorPlugin(
 *   id = "drupalentity",
 *   label = @Translation("Drupal entity"),
 *   module = "entity_embed"
 * )
 */
class DrupalEntity extends CKEditorPluginBase {

  function pluginPath() {
    return drupal_get_path('module', 'entity_embed') . '/js/plugins/drupalentity';
  }

  /**
   * {@inheritdoc}
   */
  public function getButtons() {
    return array(
      'DrupalEntity' => array(
        'label' => t('Entity'),
        'image' => $this->pluginPath() . '/icons/drupalentity.png',
      ),
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFile() {
    return $this->pluginPath() . '/plugin.js';
  }

  /**
   * {@inheritdoc}
   */
  public function getConfig(Editor $editor) {
    return array(
      'drupalEntity_dialogTitleAdd' => t('Add Entity'),
      'drupalEntity_dialogTitleEdit' => t('Edit Entity'),
    );
  }

}
