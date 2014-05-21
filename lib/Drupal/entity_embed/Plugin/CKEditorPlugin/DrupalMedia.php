<?php

/**
 * @file
 * Contains \Drupal\entity_embed\Plugin\entity_embed\plugin\DrupalMedia.
 */

namespace Drupal\entity_embed\Plugin\CKEditorPlugin;

use Drupal\ckeditor\CKEditorPluginBase;
use Drupal\editor\Entity\Editor;

/**
 * Defines the "drupalmedia" plugin.
 *
 * @CKEditorPlugin(
 *   id = "drupalmedia",
 *   label = @Translation("Drupal entity"),
 *   module = "entity_embed"
 * )
 */
class DrupalMedia extends CKEditorPluginBase {

  function pluginPath() {
    return drupal_get_path('module', 'entity_embed') . '/js/plugins/drupalmedia';
  }

  /**
   * {@inheritdoc}
   */
  public function getButtons() {
    return array(
      'DrupalMedia' => array(
        'label' => t('Media'),
        'image' => $this->pluginPath() . '/icons/drupalmedia.png',
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
      'drupalMedia_dialogTitleAdd' => t('Add Entity'),
      'drupalMedia_dialogTitleEdit' => t('Edit Entity'),
    );
  }

}
